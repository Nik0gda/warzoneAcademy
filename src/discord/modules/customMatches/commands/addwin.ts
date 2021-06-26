import { Message, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { TeamModel } from '../../../../database/teams/teams.model';
import { UserModel } from '../../../../database/users/users.model';
export default {
  name: 'addwin',
  aliases: ['addw'],
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      if (message.mentions.members.size <= 0)
        throw new Error(
          "You didn't mention the player you want to give points to",
        );
      if (message.mentions.members.size > 1)
        throw new Error('You mentioned too many players');
      if (!args[1]) {
        throw new Error('You did not supply an URL to the clip');
      }
      if (!validURL(args[1])) {
        throw new Error('Supplied URL is not a valid URL');
      }
      const team = await TeamModel.findOneByID(
        message.mentions.members.first().id,
      );
      for (const userID of team.users) {
        const user = await UserModel.findOrCreateOne(userID);
        const stats = await user.getStats();
        stats.customGames.wins++;
        user.updateStats(stats);
      }
      (message.guild.channels.cache.get(
        bot.config.resultsChannel,
      ) as TextChannel).send(
        `${team.users
          .map((userID) => `<@${userID}>`)
          .join(' ')} received 1 win each. \n${args[2]}`,
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
