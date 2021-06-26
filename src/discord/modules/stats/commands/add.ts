import { Collection, GuildMember, Message, MessageEmbed } from 'discord.js';
import Bot from '../../../..';
import { UserModel } from '../../../../database/users/users.model';
const { registerChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'add',
  aliases: ['add'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      const team = await TeamModel.findOneByID(message.member.id);
      if (!team.isTeamCreator(message.member.id))
        throw new Error('You have to be team leader to add players');

      if (team.users.length >= 3) throw new Error('Your team is already full!');
      const mentionedMembers = message.mentions.members;
      if (mentionedMembers.size === 0)
        throw new Error(
          'You did not mention the players you want to add to the team.',
        );
      for (const [_, member] of mentionedMembers) {
        const dbInfo = await UserModel.findOrCreateOne(member.id);
        if (!dbInfo.stats.id) {
          throw new Error(`${member} is not registered`);
        }
      }
      if (mentionedMembers.size + team.users.length > 3) {
        const remainingSpace = 3 - team.users.length;
        throw new Error(
          `You want to add to many players, you have ${remainingSpace} ${
            remainingSpace === 1 ? 'place' : 'places'
          } remaining.`,
        );
      }
      for (const [_, member] of mentionedMembers) {
        await team.addUser(member.id);
      }
      bot.sendDefaultEmbed(
        message,
        `${mentionedMembers.map((member) => `${member}`).join(' ')} ${
          mentionedMembers.size === 1 ? 'was' : 'were'
        } successfully added to the team`,
      );
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
