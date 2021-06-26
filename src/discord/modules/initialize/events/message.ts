import { Message } from 'discord.js';
import Bot from '../../../..';
import { command } from '../../../../../types';

export default async function (bot: Bot, message: Message): Promise<void> {
  const prefix: string = bot.config.prefix;
  const commands: command[] = bot.config.commands;
  if (message.author.bot || message.channel.type === 'dm') return;
  if (message.content[0] === prefix) {
    var args: string[] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
  } else {
    var args: string[] = message.content.trim().split(/ +/g);
  }

  let cmd: string = args.shift().toLowerCase();
  for (const command of commands) {
    if (command.name === cmd || command.aliases.includes(cmd)) {
      if (command.roleRequired)
        if (!message.member.roles.cache.has(command.roleRequired)) continue;
      if (command.channelID)
        if (message.channel.id !== command.channelID) continue;
      command.func(bot, message, args);
    }
  }
}
