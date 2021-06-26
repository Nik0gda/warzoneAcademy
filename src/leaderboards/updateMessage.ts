import { Message, MessageEmbed, TextChannel } from 'discord.js';
import Bot from '..';
import { ITeamWIUser } from '../database/teams/teams.types';
import { IUserDocument } from '../database/users/users.types';

const pointSysten = `\`\`\`css\nPoint System\`\`\`
:exclamation: **Your score can be submitted only if you got at least in Top 5 placement**


**1** - One kill

**10** Points - Win
**8** Points - Top 2
**6** Points - Top 3
**4** Points - Top 4
**2** Points - Top 5`;

export default async (
  bot: Bot,
  leaders: IUserDocument[],
  teams: ITeamWIUser[],
) => {
  const channel = bot.client.channels.cache.get(
    bot.config.leaderboardsChannel,
  ) as TextChannel;
  let messageUsers = await checkMessage(bot, channel, 'users');
  let messageTeams = await checkMessage(bot, channel, 'teams');
  await usersStatsSender(messageUsers, leaders);
  await teamsStatsSender(messageTeams, teams);
};

async function checkMessage(
  bot: Bot,
  channel: TextChannel,
  type: 'users' | 'teams',
): Promise<Message> {
  let objectType:
    | 'cachedMessageUsersLeaderboard'
    | 'cachedMessageTeamsLeaderboard';
  if (type === 'users') {
    objectType = 'cachedMessageUsersLeaderboard';
  } else {
    objectType = 'cachedMessageTeamsLeaderboard';
  }

  let message = bot[objectType];
  if (!message) {
    bot[objectType] = await channel.send('1');
    message = bot[objectType];
  } else {
    if (!channel.messages.cache.get(message.id)) {
      bot[objectType] = await channel.send('1');
      message = bot[objectType];
    }
  }
  return message;
}

async function teamsStatsSender(message: Message, teams: ITeamWIUser[]) {
  let desc = 'Congrats to Top 10: \n\n';
  const awards = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  for (let i = 0; i < 10 && i < teams.length; i++) {
    desc += `${awards[i]} ${teams[i].users
      .map((user) => `${user.stats.id}`)
      .join(' | ')} -- ${teams[i].avgPointsPerMatch || 0} APM | ${
      teams[i].points || 0
    } points\n`;
  }
  const embed = new MessageEmbed()
    .setTitle('Custom Matches Team Stats')
    .setDescription(desc)
    .setColor(0x4d6fff)
    .setTimestamp();
  message.edit({
    content: ``,
    embed: embed,
  });
}

async function usersStatsSender(message: Message, leaders: IUserDocument[]) {
  let desc = 'Congrats to Top 10: \n\n';
  const data = leaders.sort(
    (a, b) => b.stats.customGames.points - a.stats.customGames.points,
  );
  const awards = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
  for (let i = 0; i < 10 && i < data.length; i++) {
    if (i === 3) {
      desc += `-----------------------------\n`;
    }
    desc += `${awards[i]} <@${data[i].dID}> - ${
      data[i].stats.customGames.points || 0
    } points | ${data[i].stats.customGames.wins || 0} wins\n`;
  }
  const embed = new MessageEmbed()
    .setTitle('Custom Matches User Stats')
    .setDescription(desc)
    .setColor(0x4d6fff)
    .setTimestamp();
  message.edit({
    content: `${pointSysten}\nhttps://bit.ly/academyWZ`,
    embed: embed,
  });
}
