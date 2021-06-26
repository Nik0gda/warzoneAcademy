import { Message, OverwriteResolvable, TextChannel } from 'discord.js';
import Bot from '../../../..';

export default {
  name: 'startgame',
  aliases: ['startgame', 'startg'],
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    const msg = await message.channel.send(
      `The match started!\nIf you have issues with the lobby you can vote for the lobby restart using ${message.guild.emojis.cache.get(
        bot.config.restartMatchReactionID,
      )} reaction (Minimum 15 votes)`,
    );
    await msg.react(bot.config.restartMatchReactionID);
    const collector = msg.createReactionCollector(
      (reaction) => reaction.emoji.id === bot.config.restartMatchReactionID,
      {
        time: 3 * 60 * 1000,
      },
    );
    let counter: string[] = [];
    collector.on('collect', (reaction, user) => {
      if (!counter.some((x) => x === user.id)) {
        counter.push(user.id);
      }
      if (counter.length >= 15) {
        message.channel.send(
          'The match will be restarted! Wait for the host to start a new game!',
        );
        collector.stop();
      }
    });
    // collector.on('remove', (reaction, user) => {
    //   if (counter.some((x) => x === user.id)) {
    //     const sliceAt = counter.indexOf(counter.find((x) => x === user.id));
    //     counter.slice(sliceAt, 1);
    //   }
    // });
  },
};
