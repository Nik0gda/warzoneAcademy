import { TextChannel } from 'discord.js';
import Bot from '../../../..';
import initRooms from '../utils/roomCreations';
export default async function (bot: Bot): Promise<void> {
  console.log(`Logged in as ${bot.client.user.tag}!`);
  await initRooms(bot, bot.client.guilds.cache.get(bot.config.guildID));
  const channel = bot.client.channels.cache.get(
    bot.config.leaderboardsChannel,
  ) as TextChannel;
  await channel.messages.fetch();
  await channel.bulkDelete(channel.messages.cache.size || 1, true);

  // const channels = bot.client.channels;
  // console.log(channels);
  // channels.cache.forEach((channel) => {
  //   if (channel.type === 'text') {
  //     channel = channel as TextChannel;
  //     console.log((channel as TextChannel).position);
  //   }
  // });
  // const messagesToFetch = [
  //   [bot.config.welcomeChannel, bot.config.regionReactionMessage],
  //   [bot.config.modmailChannel, bot.config.modmailMessage],
  // ];
  // for (const [channel, message] of messagesToFetch) {
  //   await (bot.client.channels.cache.get(
  //     channel,
  //   ) as TextChannel).messages.fetch(message);
  // }
}
