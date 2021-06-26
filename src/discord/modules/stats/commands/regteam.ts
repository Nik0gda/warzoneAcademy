import { Collection, GuildMember, Message, MessageEmbed } from 'discord.js';
import Bot from '../../../..';
import { UserModel } from '../../../../database/users/users.model';
const { registerChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'regteam',
  aliases: ['regt', 'registerteam', 'registert'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      const mentionedMembers = message.mentions.members;
      if (mentionedMembers.size > 2)
        throw new Error(
          'Size of team can not exceed 3 members including yourself',
        );
      if (mentionedMembers.find((x) => x.id === message.member.id))
        throw new Error("You shouldn't mention youself");
      if (
        !(await UserModel.findOrCreateOne(message.member.id)).isRegistered()
      ) {
        throw new Error('You have to register your Activison ID first.');
      }
      for (const member of mentionedMembers.array()) {
        const isRegistered = (
          await UserModel.findOrCreateOne(member.id)
        ).isRegistered();
        if (!isRegistered) {
          throw new Error(
            `${member} is not registered. You can add to your team only members that are registered.`,
          );
        }
      }
      let mentionedIDs = mentionedMembers.map(
        (member: GuildMember) => member.id,
      );
      mentionedIDs = [message.author.id, ...mentionedIDs];
      await TeamModel.createOne(mentionedIDs, message.author.id);
      bot.sendDefaultEmbed(
        message,
        `You have successfully registered a team. Members: ${
          message.member
        } ${mentionedMembers.map((member) => `${member}`).join(' ')}`,
      );
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
