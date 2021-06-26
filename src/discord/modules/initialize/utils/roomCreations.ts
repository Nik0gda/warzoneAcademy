import { CategoryChannel, Guild, GuildEmoji, VoiceChannel } from 'discord.js';
import { BSONType } from 'mongodb';
import { stringify } from 'querystring';
import Bot from '../../../..';
import { generatedVoiceRoom, generatedVoiceRooms } from '../../../../../types';

async function populatingCache(): Promise<void> {}

function parseName(name: string): number {
  if (!name.includes('#')) return 0;
  const splitted = parseInt(name.replace(/ /g, '').split('#')[1]);
  if (isNaN(splitted)) return 0;
  return splitted;
}

function isEmpty(room: generatedVoiceRoom): boolean {
  return room.channel.members.size === 0;
}

async function updateNames(bot: Bot, name: string) {
  for (let i = 0; i < bot.voiceRooms[name].length; i++) {
    bot.voiceRooms[name][i].position = bot.voiceRooms[name][i].channel.position;
    if (
      parseName(bot.voiceRooms[name][i].channel.name) !==
      bot.voiceRooms[name][i].position + 1
    ) {
      await bot.voiceRooms[name][i].channel.edit({
        name: `${name} #${bot.voiceRooms[name][i].position + 1}`,
      });
    }
  }
}

export default async function initRooms(bot: Bot, guild: Guild): Promise<void> {
  for (const { id, name, limit } of bot.config.voiceChannelsCategories) {
    const category = guild.channels.cache.get(id) as CategoryChannel;
    const channels = category.children;

    for (let [_, channel] of channels) {
      bot.voiceRooms[name].push({
        channel: channel as VoiceChannel,
        position: (channel as VoiceChannel).position,
      });
    }

    bot.voiceRooms[name].sort((a, b) => a.position - b.position);
    console.log(bot.voiceRooms[name]);
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
          break;
        }
      }
      freeChannels = bot.voiceRooms[name].filter((room) => isEmpty(room))
        .length;
      bot.voiceRooms[name].sort((a, b) => a.position - b.position);
    }
  }
  // //populate bot's cache
  // bot.voiceRooms = [
  //   ...bot.voiceRooms,
  //   ...localCache.filter((cachedRoom) => filterExisting(bot, cachedRoom)),
  // ];

  // // check if position is right
  // for (const voice of bot.voiceRooms) {
  //   const localCacheRoom = localCache.find(
  //     (cachedRoom) => cachedRoom.channel === voice.channel,
  //   );
  //   if (voice.position !== localCacheRoom.position) {
  //     const index = bot.voiceRooms.findIndex((room) => room === voice);
  //     bot.voiceRooms[index] = localCacheRoom;
  //   }
  // }

  // let freeChannels = bot.voiceRooms.filter((room) => isEmpty(room));

  // while (freeChannels.length <= 2) {
  //   let position = 0;
  //   for (let i = 0; i < bot.voiceRooms.length; i++) {
  //     if (bot.voiceRooms[i + 1]) {
  //       if (bot.voiceRooms[i].position + 1 !== bot.voiceRooms[i + 1].position) {
  //         position = bot.voiceRooms[i].channel.position;
  //       }
  //     }
  //     if(i === bot.voiceRooms.length){
  //       position =
  //     }
  //   }
  //   // guild.channels.create(`Voice #${position}`, { type: 'voice', userLimit: 4, parent: category, position: });
  // }
}
