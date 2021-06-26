import { Channel, GuildMember, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { UserModel } from '../../../../database/users/users.model';

export default async function (bot: Bot, member: GuildMember): Promise<void> {
  const channel: Channel = bot.client.channels.cache.get(
    bot.config.exitEnterLogs,
  );
  // let textChan = channel as TextChannel
  await UserModel.findOrCreateOne(member.id);
  (channel as TextChannel).send(
    `:white_check_mark: <@${member.id}> Новый пользователь зашел на сервер **${
      member.user.username
    }** \`${new Date().toString()}\``,
  );
}
