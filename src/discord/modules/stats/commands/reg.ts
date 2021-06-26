import { GuildMember, Message, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { UserModel } from '../../../../database/users/users.model';
const { registerChannel } = require('../../../../../config.json');
import sendStatsMessage from '../utils/sendStatsMessage';
import updateTiers from '../utils/updateTiers';
import { publicStats } from '../../../../../types';
export default {
  name: 'reg',
  aliases: ['register'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    const activisionID = args.join(' ');
    try {
      if (!args[0]) {
        await bot.sendErrorMessage(
          message,
          `You didn't specify your activison ID`,
        );
        return;
      }

      const stats = await bot.codAPI.MWBattleData(activisionID);
      const { wins, gamesPlayed, kdRatio, scorePerMinute } = stats.br;
      if (gamesPlayed < bot.config.minimumMatches) {
        await bot.sendErrorMessage(
          message,
          `You will not be registered because you played less than ${bot.config.minimumMatches} matches`,
        );
        return;
      }
      const publicStats: publicStats = {
        kd: Math.round(kdRatio * 100) / 100,
        spm: Math.round(scorePerMinute * 100) / 100,
        matches: gamesPlayed,
        wins: wins,
      };
      try {
        await message.member.setNickname(activisionID);
      } catch (err) {}

      const user = await UserModel.findOrCreateOne(message.author.id);
      await user.updateActivisionID(activisionID);
      await updateTiers(bot, kdRatio, message.member);
      await sendStatsMessage(
        bot,
        user,
        message.channel as TextChannel,
        publicStats,
      );
    } catch (err) {
      console.log(err);
      message.reply(
        `No player found with activision id \`${activisionID}\`. Example: \`!reg Nik0gda#1437625\``,
      );
    }
  },
};
