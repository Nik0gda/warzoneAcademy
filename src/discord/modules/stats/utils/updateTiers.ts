import { GuildMember } from 'discord.js';
import Bot from '../../../..';

export default async function (
  bot: Bot,
  kd: number,
  member: GuildMember,
): Promise<void> {
  const roles = bot.config.tierRoles.sort((a, b) => a.min - b.min);
  for (const role of roles) {
    if (member.roles.cache.some((memberRole) => memberRole.id !== role.id)) {
      await member.roles.remove(role.id);
    }
  }

  for (let i = 0; i < roles.length; i++) {
    if (i + 1 < roles.length) {
      if (kd > roles[i].min && kd < roles[i + 1].min) {
        await member.roles.add(roles[i].id);
        return;
      }
    } else {
      await member.roles.add(roles[roles.length - 1].id);
      return;
    }
  }
}
