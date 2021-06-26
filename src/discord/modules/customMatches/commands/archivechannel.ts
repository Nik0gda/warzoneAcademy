import { Message, OverwriteResolvable, TextChannel } from 'discord.js';
import Bot from '../../../..';
import { TeamModel } from '../../../../database/teams/teams.model';
export default {
  name: 'archivechannel',
  aliases: ['archivechannel'],
  roleRequired: '777158205050454016',
  func: async (bot: Bot, message: Message, args: string[]) => {
    if (
      (message.channel as TextChannel).parentID ===
        bot.config.customMatchesCategory &&
      message.channel.id !== bot.config.registerChannel
    ) {
      const permissions: OverwriteResolvable[] = [
        {
          id: bot.config.everyoneRoleID,
          deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
      ];
      for (const roleID of bot.config.adminRolesIDs)
        permissions.push({
          id: roleID,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        });
      await (message.channel as TextChannel).edit({
        parentID: bot.config.archivedChannelsCategory,
        permissionOverwrites: permissions,
      });
    }
  },
};
