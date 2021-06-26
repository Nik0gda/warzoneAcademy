import { GuildMemberManager, Message, Team } from 'discord.js';
import Bot from '../../../..';
const { registerChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'unreg',
  aliases: ['unregister'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      const document = await TeamModel.findOneByID(message.author.id);
      if (bot.cache.some((x) => x.createdBy === document.createdBy)) {
        (bot.cache = bot.cache.filter(
          (x) => x.createdBy !== document.createdBy,
        )),
          console.log(bot.cache);
      }

      if (document.isTeamCreator(message.author.id)) {
        document.deleteTeam();
        bot.sendDefaultEmbed(
          message,
          'You successfully disassembled your team',
        );

        document.users.forEach(async (userID) => {
          if (userID != message.author.id) {
            const member = await bot.getMember(message.guild, userID);
            member.send(`${message.member.user.tag} disassembled your team.`);
          }
        });
        return;
      }

      await document.deleteUser(message.author.id);

      document.users.forEach(async (userID) => {
        if (userID != message.author.id) {
          const member = await bot.getMember(message.guild, userID);
          await member.send(`${message.member.user.tag} left your team`);
        }
      });
      await bot.sendDefaultEmbed(message, 'You successfully left your team');
    } catch (err) {
      await bot.sendErrorMessage(message, err.message);
    }
  },
};
