import {
  GuildMember,
  MessageEmbed,
  Role,
  TextChannel,
  VoiceState,
} from 'discord.js';
import Bot from '../../../..';

export default async (bot: Bot, oldState: VoiceState, newState: VoiceState) => {
  const channel: TextChannel = oldState.guild.channels.cache.get(
    bot.config.voiceLogs,
  ) as TextChannel;
  const oldChannelID: string = oldState.channelID;
  const newChannelID: string = newState.channelID;
  const currentTime: string = new Date().toLocaleString();
  let message: string;
  let member: GuildMember;
  if (oldChannelID === newChannelID) return;
  if (!oldChannelID && newChannelID) {
    // entered in voice channel
    message = `:mans_shoe: Участник ${newState.member} вошел в канал \`${newState.channel.name}\` [\`${currentTime}\`]`;
    member = newState.member;
  }
  if (oldChannelID && newChannelID && newChannelID !== oldChannelID) {
    // switched channels
    message = `:left_right_arrow: Участник ${newState.member} переместился из канала \`${oldState.channel.name}\` в канал \`${newState.channel.name}\` [\`${currentTime}\`]\``;
    member = newState.member;
  }
  if (oldChannelID && !newChannelID) {
    // exited voice channel
    message = `:runner: Участник ${oldState.member} вышел из канал \`${oldState.channel.name}\` [\`${currentTime}\`]`;
    member = oldState.member;
  }
  if (
    member.roles.cache.some((role: Role) =>
      bot.config.adminRolesIDs.includes(role.id),
    )
  ) {
    channel.send(new MessageEmbed().setDescription(message));
    return;
  }
  channel.send(message);
};
