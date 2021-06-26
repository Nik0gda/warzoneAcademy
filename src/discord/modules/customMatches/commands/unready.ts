import { Message } from 'discord.js';
import Bot from '../../../..';
const { readyChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'unready',
  aliases: ['-', '--', 'unread'],
  channelID: readyChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      const team = await TeamModel.findOneByID(message.author.id);
      console.log(
        bot.cache,
        team,
        bot.cache.find((cachedTeam) => cachedTeam.createdBy == team.createdBy),
      );
      if (!team) throw new Error("You're not a member of any team");
      const isLeader = team.isTeamCreator(message.author.id);
      if (
        !bot.cache.find((cachedTeam) => cachedTeam.createdBy == team.createdBy)
      )
        throw new Error('Your team is not in the queue');
      if (!isLeader)
        throw new Error(
          "You're not the leader of the team, only he can start the match",
        );
      const index = bot.cache.findIndex(
        (cachedTeam) => cachedTeam.createdBy == team.createdBy,
      );
      console.log(index);
      bot.cache.splice(index, 1);
      await bot.sendDefaultEmbed(
        message,
        'You successfully unregistered your team',
      );
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
