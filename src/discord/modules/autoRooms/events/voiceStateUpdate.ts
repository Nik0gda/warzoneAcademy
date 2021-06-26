import { VoiceState } from 'discord.js';
import Bot from '../../../..';
import updateRoom from '../utils/updateRooms';
export default async (bot: Bot, oldState: VoiceState, newState: VoiceState) => {
  const oldChannelID: string = oldState.channelID;
  const newChannelID: string = newState.channelID;
  const guild = oldState.guild || newState.guild;
  if (oldChannelID === newChannelID) return;
  await updateRoom(bot, guild);
};
