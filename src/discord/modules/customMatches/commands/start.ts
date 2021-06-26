import { Message, OverwriteResolvable, TextChannel } from 'discord.js';
import Bot from '../../../..';
const { readyChannel } = require('../../../../../config.json');
import { TeamModel } from '../../../../database/teams/teams.model';
import { UserModel } from '../../../../database/users/users.model';
export default {
  name: 'start',
  aliases: ['start'],
  channelID: readyChannel,
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    await message.delete();
    console.log(bot.cache);
    if (bot.cache.length == 0) {
      await bot.sendErrorMessage(message, 'No teams have registered');
      return;
    }

    // while (message.channel.messages.cache.size > 0) {
    //   try {
    //     await (message.channel as TextChannel).bulkDelete(100);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    const permissions: OverwriteResolvable[] = [
      {
        id: bot.config.everyoneRoleID,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
      },
    ];
    for (const cacheTeam of bot.cache) {
      for (const userID of cacheTeam.users) {
        permissions.push({
          id: userID,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        });
      }
    }
    for (const roleID of bot.config.adminRolesIDs)
      permissions.push({
        id: roleID,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
      });
    const category = message.guild.channels.cache.get(
      bot.config.customMatchesCategory,
    );
    const channel: TextChannel = await message.guild.channels.create(
      `Match by ${message.author.tag} `,
      {
        type: 'text',
        parent: category,
        permissionOverwrites: permissions,
        topic: new Date().toLocaleString(),
      },
    );
    channel.send(
      `@everyone In the next 5 minutes ${message.member} will send you the invite`,
    );

    //Send info about playing teams
    let teamsContent = '';
    for (const i in bot.cache) {
      let teamText = `Squad #${parseInt(i) + 1}`;
      for (const user of bot.cache[i].users) {
        const model = await UserModel.findOrCreateOne(user);
        const { id } = model.stats;
        teamText += ` | <@${user}> ${id}`;

        const stats = await model.getStats();
        stats.customGames.matches++;
        model.updateStats(stats);
      }
      teamText += '\n';
      if (teamsContent.length + teamText.length > 2000) {
        await channel.send(teamsContent);
        teamsContent = '';
      }
      teamsContent += teamText;
    }
    await channel.send(teamsContent);
    bot.playingCache = [...bot.playingCache, ...bot.cache];
    bot.cache = [];
  },
};
