import {
  GuildChannel,
  GuildMember,
  MessageEmbed,
  TextChannel,
  User,
} from 'discord.js';
import Bot from '../../../..';
import { publicStats } from '../../../../../types';
import { IUserDocument } from '../../../../database/users/users.types';

export default async function (
  bot: Bot,
  userObject: IUserDocument,
  channel: TextChannel,
  stats: publicStats,
): Promise<void> {
  const activisionID = userObject.stats.id;
  const embed = new MessageEmbed();
  const description = `User: <@${
    userObject.dID
  }>\nNickname: [${activisionID}](${getLink(activisionID)})`;
  const regularStatsField = composeRegularStatsField(stats);
  const customStatsField = await composeCustomStatsField(userObject);

  embed.setColor(0x4d6fff);
  embed.attachFiles(['./statics/stats.png']);
  embed.setThumbnail('attachment://stats.png');
  embed.setDescription(description);
  embed.addField('Public Matches', regularStatsField, true);
  embed.addField('Academy Matches', customStatsField, true);

  await channel.send(embed);
}

async function composeCustomStatsField(stats: IUserDocument): Promise<string> {
  console.log(await stats.getStats());
  const { matches, wins, points } = (await stats.getStats()).customGames;
  let field = `> Points: **${points}**\n`;
  field += `> Matches: **${matches}**\n`;
  field += `> Winrate: **${wins}**\n`;
  return field;
}

function composeRegularStatsField(stats: publicStats): string {
  const { kd, spm, matches, wins } = stats;
  const winrate = calculateWinrate(matches, wins);
  let field = `> K/D: **${kd}**\n`;
  field += `> SPM: **${spm}**\n`;
  field += `> Matches: **${matches}**\n`;
  field += `> Winrate: **${winrate}%**\n`;
  return field;
}

function calculateWinrate(matches: number, wins: number): number {
  return Math.round((wins / matches) * 100 * 100) / 100;
}
function getLink(activisionID: string): string {
  return `https://cod.tracker.gg/warzone/profile/battlenet/${encodeURIComponent(
    activisionID,
  )}/overview`;
}
