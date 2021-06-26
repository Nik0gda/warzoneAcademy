import { Message } from 'discord.js';
import Bot from '../../../..';
const { readyChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'ready',
  aliases: ['+', '++', 'read'],
  channelID: readyChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      try {
        var team = await TeamModel.findOneByID(message.author.id);
      } catch (err) {
        throw new Error("You're not a member of any team");
      }

      const isLeader = team.isTeamCreator(message.author.id);
      if (!isLeader)
        throw new Error(
          "You're not the leader of the team, only he can start the match",
        );
      if (team.users.length < 2) {
        throw new Error(
          'You must be at least 2 members in a team to play custom matches.',
        );
      }
      if (
        bot.cache.some((cachedTeam) => cachedTeam.createdBy == team.createdBy)
      )
        throw new Error("You're already in the queue!");
      if (
        bot.playingCache.some(
          (cachedTeam) => cachedTeam.createdBy == team.createdBy,
        )
      )
        throw new Error("You're already playing!");

      // const isNotFullByNrOfTeams = bot.cache.length < bot.config.maxTeams;
      bot.cache.push(team);
      const numberOfPlayers = bot.cache.reduce(
        (accum, team) => accum + team.users.length,
        0,
      );
      // const isNotFullByNrOfPlayers = numberOfPlayers < bot.config.maxPlayers;
      // if (isNotFullByNrOfTeams && isNotFullByNrOfPlayers) {
      bot.sendDefaultEmbed(
        message,
        `Your team has succesufully entered the queue. Players in the queue: ${numberOfPlayers}`,
      );

      //   return;
      // }
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
