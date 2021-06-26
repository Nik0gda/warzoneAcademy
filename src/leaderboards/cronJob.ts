import Bot from '..';
import updateMessage from './updateMessage';
import updateSpreadsheet from './updateSpreadsheet';
import { getTeams, getUsers } from './getDataFromDb';
export default async (bot: Bot) => {
  const leaders = await getUsers();
  const teams = await getTeams();
  await updateMessage(bot, leaders, teams);
  await updateSpreadsheet(bot, leaders, teams);
};
