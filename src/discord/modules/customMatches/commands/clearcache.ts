import { Message, TextChannel } from 'discord.js';
import Bot from '../../../..';

export default {
  name: 'clearqueue',
  aliases: ['clearqueue'],
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      while (message.channel.messages.cache.size > 0) {
        try {
          await (message.channel as TextChannel).bulkDelete(100);
        } catch (err) {
          console.log(err);
        }
      }
      bot.cache = [];
      await bot.sendDefaultEmbed(message, 'The queue was cleared.');
    } catch (err) {
      console.log(err);
    }
  },
};
