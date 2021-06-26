import { CategoryChannel, Guild } from 'discord.js';
import Bot from '../../../..';
import { generatedVoiceRoom } from '../../../../../types';

function isEmpty(room: generatedVoiceRoom): boolean {
  return room.channel.members.size === 0;
}

function parseName(name: string): number {
  if (!name.includes('#')) return 0;
  const splitted = parseInt(name.replace(/ /g, '').split('#')[1]);
  if (isNaN(splitted)) return 0;
  return splitted;
}

async function updateNames(bot: Bot, name: string) {
  for (let i = 0; i < bot.voiceRooms[name].length; i++) {
    bot.voiceRooms[name][i].position = bot.voiceRooms[name][i].channel.position;
    if (
      parseName(bot.voiceRooms[name][i].channel.name) !==
      bot.voiceRooms[name][i].position + 1
    ) {
      await bot.voiceRooms[name][i].channel.edit({
        name: name,
      });
    }
  }
}

export default async function updateRooms(bot: Bot, guild: Guild) {
  for (const { id, name, limit } of bot.config.voiceChannelsCategories) {
    const category = guild.channels.cache.get(id) as CategoryChannel;

    let freeChannels = bot.voiceRooms[name].filter((room) => isEmpty(room))
      .length;
    while (freeChannels <= 2) {
      const channel = await guild.channels.create(name, {
        type: 'voice',
        userLimit: limit,
        parent: category,
        position: bot.voiceRooms[name].length + 1,
      });
      bot.voiceRooms[name].push({
        channel: channel,
        position: channel.position,
      });
      freeChannels = bot.voiceRooms[name].filter((room) => isEmpty(room))
        .length;
      bot.voiceRooms[name].sort((a, b) => a.position - b.position);
    }
    while (freeChannels > 3) {
      for (let i = bot.voiceRooms[name].length - 1; i >= 0; i--) {
        if (isEmpty(bot.voiceRooms[name][i])) {
          await bot.voiceRooms[name][i].channel.delete();
          bot.voiceRooms[name].splice(i, 1);
          // await updateNames(bot, name);
          break;
        }
      }
      freeChannels = bot.voiceRooms[name].filter((room) => isEmpty(room))
        .length;
      bot.voiceRooms[name].sort((a, b) => a.position - b.position);
    }
  }
}
