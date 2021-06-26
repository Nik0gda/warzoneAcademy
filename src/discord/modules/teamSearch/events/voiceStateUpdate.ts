import { GuildMember, VoiceState } from 'discord.js';
import Bot from '../../../..';
import messageComposer from '../utils/messageComposer';
export default async (bot: Bot, oldState: VoiceState, newState: VoiceState) => {
  const oldChannelID: string = oldState.channelID;
  const newChannelID: string = newState.channelID;
  const guild = oldState.guild || newState.guild;
  if (oldChannelID === newChannelID) return;

  // entered in voice channel
  for (const channelID of [oldChannelID, newChannelID]) {
    if (!channelID) continue;
    const cachedObject = bot.cachedInvites.find(
      (obj) => obj.channel.id === channelID,
    );
    if (!cachedObject) continue;
    if (cachedObject.channel.members.size === 0) {
      await cachedObject.message.delete();
      const index = bot.cachedInvites.indexOf(cachedObject);
      bot.cachedInvites.splice(index, 1);
      continue;
    }
    await messageComposer(
      bot,
      guild,
      cachedObject.comment,
      cachedObject.channel,
      cachedObject,
    );
  }
};
