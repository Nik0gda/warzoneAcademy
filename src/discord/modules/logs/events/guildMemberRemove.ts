import { Channel, GuildMember, TextChannel } from 'discord.js';
import Bot from '../../../..';

export default async function (bot: Bot, member: GuildMember): Promise<void> {
  const channel: Channel = bot.client.channels.cache.get(
    bot.config.exitEnterLogs,
  );
  // let textChan = channel as TextChannel
  (channel as TextChannel).send(
    `:rage: <@${member.id}> Ливнул с сервера -> Ник на сервере **${
      member.user.username
    }** \`${new Date().toString()}\``,
  );
}
