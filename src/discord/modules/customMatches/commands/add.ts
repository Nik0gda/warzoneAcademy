import { Message, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { TeamModel } from '../../../../database/teams/teams.model';
import { UserModel } from '../../../../database/users/users.model';
export default {
  name: 'add',
  aliases: ['addpoints', 'addp'],
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      if (message.mentions.members.size <= 0)
        throw new Error(
          "You didn't mention the player you want to give points to",
        );
      if (message.mentions.members.size > 1)
        throw new Error('You mentioned too many players');
      if (!args[1])
        throw new Error("You didn't supply amount of points to be added");
      if (isNaN(parseInt(args[1])))
        throw new Error('The amount of points you supplied is not a number');

      if (!args[2]) {
        throw new Error('You did not supply an URL to the clip');
      }
      if (!validURL(args[2])) {
        throw new Error('Supplied URL is not a valid URL');
      }
      const team = await TeamModel.findOneByID(
        message.mentions.members.first().id,
      );
      const points = Math.floor(parseInt(args[1]) / team.users.length);
      for (const userID of team.users) {
        const user = await UserModel.findOrCreateOne(userID);
        const stats = await user.getStats();
        stats.customGames.points += points;
        user.updateStats(stats);
      }
      (message.guild.channels.cache.get(
        bot.config.resultsChannel,
      ) as TextChannel).send(
        `${team.users
          .map((userID) => `<@${userID}>`)
          .join(' ')} received ${points} points each. \n${args[2]}`,
      );
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};

function validURL(str: string): boolean {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i', // fragment locator
  );
  return !!pattern.test(str);
}
