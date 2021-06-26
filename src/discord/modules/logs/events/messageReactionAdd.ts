import { GuildMember, MessageReaction, User } from 'discord.js';
import Bot from '../../../..';

export default async function (
  bot: Bot,
  reaction: MessageReaction,
  user: User,
): Promise<void> {
  // When we receive a reaction we check if the reaction is partial or not
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the
    // fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch();
    } catch (error) {
      console.log('Something went wrong when fetching the message: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  const member: GuildMember = await bot.getMember(
    reaction.message.guild,
    user.id,
  );
  if (reaction.message.channel.id === bot.config.welcomeChannel) {
    const roles: string[][] = [
      ['635172666629947402', '🇺🇸'],
      ['635172644836212752', '🇷🇺'],
      ['776529356952305674', '🇪🇺'],
    ];
    for (const [role, emoji] of roles) {
      if (reaction.emoji.name === emoji) {
        if (!member.roles.cache.has(role)) await member.roles.add(role);
        else await member.roles.remove(role);
      }
    }
    await reaction.users.remove(user.id);
  }
}
