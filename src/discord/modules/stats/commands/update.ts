import { Message, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { UserModel } from '../../../../database/users/users.model';
const { registerChannel } = require('../../../../../config.json');
import sendStatsMessage from '../utils/sendStatsMessage';
import updateTiers from '../utils/updateTiers';
import { publicStats } from '../../../../../types';
export default {
  name: 'update',
  aliases: ['upd', 's', 'stats'],
  channelID: registerChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      var user = await UserModel.findOrCreateOne(message.author.id);
      if (!user.stats.id) {
        message.reply('You have to register first!');
        return;
      }

      try {
        var stats = await bot.codAPI.MWBattleData(user.stats.id);
      } catch (err) {
        message.reply(
          'Member with your current activision id was not found! Retry or register with new activision ID',
        );
        return;
      }
      const { wins, gamesPlayed, kdRatio, scorePerMinute } = stats.br;
      const publicStats: publicStats = {
        kd: Math.round(kdRatio * 100) / 100,
        spm: Math.round(scorePerMinute * 100) / 100,
        matches: gamesPlayed,
        wins: wins,
      };
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
        `Unexpected error: \`${err.message}\`.Retry or contact Administrator `,
      );
    }
  },
};
