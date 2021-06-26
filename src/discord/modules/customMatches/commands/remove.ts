import { Message, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { TeamModel } from '../../../../database/teams/teams.model';
import { UserModel } from '../../../../database/users/users.model';
export default {
  name: 'remove',
  aliases: ['removepoints', 'removep'],
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      if (message.mentions.members.size <= 0)
        throw new Error(
          "You didn't mention the player you want to give points to",
        );
      if (!args[1])
        throw new Error("You didn't supply amount of points to be removed");
      if (isNaN(parseInt(args[1])))
        throw new Error('The amount of points you supplied is not a number');
      const points = Math.floor(parseInt(args[1]));
      const mentioned = message.mentions.members.first();
      const user = await UserModel.findOrCreateOne(mentioned.id);
      const stats = await user.getStats();
      stats.customGames.points -= points;
      user.updateStats(stats);

      (message.guild.channels.cache.get(
        bot.config.resultsChannel,
      ) as TextChannel).send(
        `${message.member} removed ${mentioned} ${points} points.`,
      );
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
