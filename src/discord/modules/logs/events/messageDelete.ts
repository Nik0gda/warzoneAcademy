import { Message, MessageEmbed, TextChannel } from 'discord.js';
import Bot from '../../../..';

export default async (bot: Bot, message: Message) => {
  try {
    let channel = message.guild.channels.cache.get(bot.config.messageLogs);
    if (channel.id == message.channel.id) return;
    if (message.author.id === bot.client.user.id) return;
    if (message.cleanContent.length == 0) return;
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor(0xfc3c3c)
      .setDescription(
        `**Сообщение от** ${message.member} **удалено в канале** ${message.channel}** : **\n${message.cleanContent}`,
      )
      .setTimestamp();
    (channel as TextChannel).send(embed);
  } catch (err) {
    console.log();
  }
};
