import { Collection, GuildMember, Message, MessageEmbed } from 'discord.js';
import Bot from '../../../..';
import { UserModel } from '../../../../database/users/users.model';
const { registerChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'remove',
  aliases: ['remove'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      const team = await TeamModel.findOneByID(message.member.id);
      if (!team.isTeamCreator(message.member.id))
        throw new Error('You have to be team leader to remove players');
      const mentionedMembers = message.mentions.members;
      if (mentionedMembers.size === 0)
        throw new Error(
          'You did not mention the players you want to remove from the team.',
        );
      for (const [_, member] of mentionedMembers) {
        if (!team.users.includes(member.id)) {
          throw new Error(`${member} is not in your team`);
        }
      }
      for (const [_, member] of mentionedMembers) {
        await team.deleteUser(member.id);
      }
      bot.sendDefaultEmbed(
        message,
        `${mentionedMembers.map((member) => `${member}`).join(' ')} ${
          mentionedMembers.size === 1 ? 'was' : 'were'
        } successfully removed from the team`,
      );
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
