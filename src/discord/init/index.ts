const { readdirSync } = require('fs');
import { TextChannel } from 'discord.js';
import Bot from '../../';
import { command } from '../../../types';
export default (bot: Bot) => {
  bot.config.commands = [];
  bot.cachedInvites = [];
  bot.voiceRooms = { Squad: [], Trio: [], Duo: [] };
  bot.playingCache = [];
  bot.cache = [];
  const basePath: string = './src/discord';
  const modules: string[] = readdirSync(`${basePath}/modules`);
  for (const module of modules) {
    try {
      const commandsFiles: string[] = readdirSync(
        `${basePath}/modules/${module}/commands`,
      ).filter((dir: string) => dir.endsWith('.ts' || '.js'));

      for (const file of commandsFiles) {
        const {
          name,
          aliases,
          roleRequired,
          channelID,
          func,
        } = require(`../modules/${module}/commands/${file}`).default;
        const command: command = {
          name,
          aliases,
          roleRequired,
          channelID,
          func,
        };
        bot.config.commands.push(command);
      }
    } catch (err) {}
    try {
      const eventsFiles: string[] = readdirSync(
        `${basePath}/modules/${module}/events`,
      ).filter((dir: string) => dir.endsWith('.ts' || '.js'));

      for (const file of eventsFiles) {
        const func: (
          bot: Bot,
          ...args: any[]
        ) => Promise<void> = require(`../modules/${module}/events/${file}`)
          .default;
        const eventName: string = file.split('.')[0];
        bot.client.on(eventName, (...args) => func(bot, ...args));
      }
    } catch (err) {
      console.error(err);
    }
  }
};
