import { Message, TextChannel } from 'discord.js';
import Bot from '../../../..';
export default {
  name: 'clearchat',
  aliases: ['clearchat'],
  roleRequired: '568919691666522115',
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      if (!args[0]) throw new Error('Amount of messages not provided');

      if (isNaN(parseInt(args[0])))
        throw new Error('Amount specified is not a number');
      (message.channel as TextChannel).bulkDelete(parseInt(args[0]));
    } catch (err) {
      bot.sendErrorMessage(message, err.message);
    }
  },
};
