import {
  Emoji,
  Guild,
  GuildChannel,
  Message,
  MessageEmbed,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import Bot from '../../../..';
import { teamSearch } from '../../../../../types';
import { UserModel } from '../../../../database/users/users.model';
import message from '../../initialize/events/message';

export default async (
  bot: Bot,
  guild: Guild,
  comments: string,
  currentVoiceChannel: VoiceChannel,
  cachedObject?: teamSearch,
): Promise<teamSearch> => {
  let description = '';
  currentVoiceChannel.members.forEach(async (member) => {
    const dbInfo = await UserModel.findOrCreateOne(member.id);
    const dbStats = await dbInfo.getStats();
    const { registeredEmojiID, notRegisteredEmojiID } = bot.config;
    const state = dbStats.id ? registeredEmojiID : notRegisteredEmojiID;
    let link = '';
    if (state === registeredEmojiID) {
      link += `[${getEmoji(
        guild,
        registeredEmojiID,
      )}](https://cod.tracker.gg/warzone/profile/atvi/${dbStats.id}/overview)`;
    } else link = `${getEmoji(guild, notRegisteredEmojiID)}`;

    // Region Select
    const { russianRoleID, europeRoleID, northAmericaRoleID } = bot.config;
    const regionRoles = [russianRoleID, europeRoleID, northAmericaRoleID];
    let regionContent = '';
    for (const region of regionRoles) {
      if (member.roles.cache.has(region)) {
        regionContent = region;
        break;
      }
    }

    const role = member.roles.cache.find((role) =>
      bot.config.tierRoles.some((x) => x.id === role.id),
    );
    description += `\n${member} ${link} ${role || ''} ${
      dbStats.customGames.points
    } points`;
    if (regionContent) {
      description += ` | ${guild.roles.cache.get(regionContent)}`;
    }
  });

  //creating invite
  const invite = await currentVoiceChannel.createInvite({});
  description += `\n\nJoin: ${invite}`;
  if (comments)
    description += `\n${getEmoji(
      guild,
      bot.config.commentsEmojiID,
    )} ${comments}`;

  //title depending on the full of room
  const spaceleft =
    currentVoiceChannel.userLimit - currentVoiceChannel.members.size < 0
      ? 0
      : currentVoiceChannel.userLimit - currentVoiceChannel.members.size;
  let color = spaceleft === 0 ? 0x4a4a4a : 0x0c7d29;

  let title = `Looking for +${spaceleft} in ${currentVoiceChannel.name}`;
  if (currentVoiceChannel.full) {
    title = `Playing in ${currentVoiceChannel.name}`;
  }
  const imageName = getImageName(spaceleft);
  const embed = new MessageEmbed()
    .setColor(color)
    .setDescription(description)
    .setTitle(title)
    .setThumbnail(imageName);
  const channel = guild.channels.cache.get(
    bot.config.searchChannel,
  ) as TextChannel;
  let message;
  if (cachedObject) {
    message = await cachedObject.message.edit('', embed);
  } else message = await channel.send(embed);
  return {
    message,
    channel: currentVoiceChannel,
    channelInvite: invite,
    comment: comments,
  };
};

function getImageName(slotsRemaining: number): string {
  switch (slotsRemaining) {
    case 0:
      return 'https://i.imgur.com/ig7UXKH.png';
    case 1:
      return 'https://i.imgur.com/tDsZ9nx.png';
    case 2:
      return 'https://i.imgur.com/EZw1Phj.png';
    case 3:
      return 'https://i.imgur.com/d62SzuV.png';
    default:
      return 'https://i.imgur.com/Ruf8Nwm.png';
  }
}

function getEmoji(guild: Guild, id: string): Emoji {
  return guild.emojis.cache.get(id);
}
