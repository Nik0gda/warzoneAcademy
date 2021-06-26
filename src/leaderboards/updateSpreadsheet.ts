import { IUserDocument } from '../database/users/users.types';
const googleCreds = require('../../googleCreds.json');
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Bot from '..';
import { ITeamWIUser } from '../database/teams/teams.types';

export default async function updateSpreadsheet(
  bot: Bot,
  leaders: IUserDocument[],
  teams: ITeamWIUser[],
): Promise<void> {
  await initSpreadsheets(bot);
  const [sheetUsers, sheetTeams] = bot.spreadsheets;
  await sheetUsers.clear();
  await sheetTeams.clear();
  await sheetUsers.setHeaderRow([
    'UserID',
    'ActivisionID',
    'Last Profile Update',
    'Points',
    'Matches',
    'Wins',
  ]);
  await sheetTeams.setHeaderRow([
    'User 1',
    'User 2',
    'User 3',
    'Team APM',
    'Avg. Matches per User',
    'Avg. Points per User',
    'Total Points',
  ]);
  const dataUsers = refactorDataUsers(leaders);
  const dataTeams = refactorDataTeams(teams);
  await sheetUsers.addRows(dataUsers);
  await sheetTeams.addRows(dataTeams);
}

function refactorDataTeams(teams: ITeamWIUser[]): string[][] {
  const data: string[][] = [];
  teams.forEach((team) => {
    const arr = [
      '',
      '',
      '',
      (Math.round(team.avgPointsPerMatch * 100) / 100 || '0').toString(),
      (Math.round(team.avgMatches * 100) / 100 || '0').toString(),
      (Math.round(team.avgPoints * 100) / 100 || '0').toString(),
      (Math.round(team.points * 100) / 100 || '0').toString(),
    ];
    for (let i = 0; i < 3; i++) {
      if (team.users[i]) {
        const user = team.users[i];
        arr[i] = `${user.stats.id} (${user.dID})`;
      }
    }
    data.push(arr);
  });
  return data;
}

function refactorDataUsers(leaders: IUserDocument[]): string[][] {
  const data: string[][] = [];
  leaders.forEach((leader) =>
    data.push([
      leader.dID,
      leader.stats.id,
      leader.lastUpdated.toString(),
      (leader.stats.customGames.points || '0').toString(),
      (leader.stats.customGames.matches || '0').toString(),
      (leader.stats.customGames.wins || '0').toString(),
    ]),
  );
  return data;
}

async function initSpreadsheets(bot: Bot): Promise<void> {
  const doc = new GoogleSpreadsheet(
    '1sn9hLN05_vO_Cj4Fg3IrlpzaoJr1TRa1cwgllZwfZpE',
  );
  await doc.useServiceAccountAuth(googleCreds);
  await doc.loadInfo();
  bot.spreadsheets = doc.sheetsByIndex;
}
