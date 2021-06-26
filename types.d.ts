import { Invite, Message, VoiceChannel } from 'discord.js';
import Bot from './src';

declare module '*.json' {
  const value: any;
  export default value;
}

export interface command {
  name: string;
  aliases: string[];
  roleRequired?: string;
  channelID?: string;
  func: (bot: Bot, ...args: any[]) => Promise<void>;
}

export interface dbStats {
  id: string;
  customGames: {
    matches: number;
    points: number;
    wins: number;
  };
}

export interface embedInfo {
  title: string;
  color: number;
  description?: string;
}

export interface teamSearch {
  message: Message;
  channel: VoiceChannel;
  channelInvite: Invite;
  comment: string;
}

export interface generatedVoiceRoom {
  channel: VoiceChannel;
  position: number;
}

export interface generatedVoiceRooms {
  [key: string]: generatedVoiceRoom[];
}

export interface publicStats {
  kd: number;
  spm: number;
  matches: number;
  wins: number;
}

export interface tierRole {
  id: string;
  min?: number;
}

export interface voiceChannelCategory {
  id: string;
  name: string;
  limit: number;
}

export interface configType {
  guildID: string;
  adminRolesIDs: string[];
  tierRoles: tierRole[];
  voiceChannelsCategories: voiceChannelCategory[];
  everyoneRoleID: string;
  russianRoleID: string;
  europeRoleID: string;
  northAmericaRoleID: string;
  searchChannel: string;
  resultsChannel: string;
  leaderboardsChannel: string;
  registerChannel: string;
  readyChannel: string;
  exitEnterLogs: string;
  messageLogs: string;
  voiceLogs: string;
  modmailLogs: string;
  welcomeChannel: string;
  modmailChannel: string;
  regionReactionMessage: string;
  modmailMessage: string;
  modmailCategory: string;
  customMatchesCategory: string;
  voiceChannelsCategory: string;
  archivedChannelsCategory: string;
  restartMatchReactionID: string;
  notRegisteredEmojiID: string;
  registeredEmojiID: string;
  commentsEmojiID: string;
  prefix: string;
  maxTeams: number;
  maxPlayers: number;
  minimumMatches: number;
  commands?: command[];
}
