import { Message, MessageEmbed } from 'discord.js';
import Bot from '../../../..';
const { searchChannel } = require('../../../../../config.json');
import messageComposer from '../utils/messageComposer';
export default {
  name: 'search',
  aliases: ['+', '++'],
  channelID: searchChannel,
  func: async (bot: Bot, message: Message, args: string[]) => {
    try {
      console.log(bot.cachedInvites);
      const comments = args.join(' ');
      const currentVoiceChannel = message.member.voice.channel;
      await message.delete();
      if (!currentVoiceChannel) return;

      if (
        currentVoiceChannel.members.size >= 6 ||
        currentVoiceChannel.full ||
        currentVoiceChannel.userLimit >= 6
      )
        return;
      if (
        bot.cachedInvites.some(
          (search) => search.channel.id === currentVoiceChannel.id,
        )
      ) {
        const index = bot.cachedInvites.findIndex(
          (search) => search.channel.id === currentVoiceChannel.id,
        );
        bot.cachedInvites[index].comment = comments;
        await messageComposer(
          bot,
          message.guild,
          comments,
          currentVoiceChannel,
          bot.cachedInvites[index],
        );
        return;
      }
      console.log(33);
      bot.cachedInvites.push(
        await messageComposer(
          bot,
          message.guild,
          comments,
          currentVoiceChannel,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  },
};
