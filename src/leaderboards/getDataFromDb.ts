import { TeamModel } from '../database/teams/teams.model';
import { ITeamWIUser } from '../database/teams/teams.types';
import { UserModel } from '../database/users/users.model';
import { IUser, IUserDocument } from '../database/users/users.types';

export async function getUsers(): Promise<IUserDocument[]> {
  let users = await UserModel.find();
  return users
    .filter((user) => user.stats.id)
    .sort(
      (user1, user2) =>
        user2.stats.customGames.points - user1.stats.customGames.points,
    );
}

export async function getTeams(): Promise<ITeamWIUser[]> {
  let teams = await TeamModel.find();
  let returnTeams: ITeamWIUser[] = [];
  for (const team of teams) {
    let users: IUserDocument[] = [];
    for (const id of team.users) {
      users.push(await UserModel.findOneObject(id));
    }
    const matches = users.reduce(reducerMatches, 0);
    const points = users.reduce(reducerPoints, 0);
    const avgMatches = matches / users.length;
    const avgPoints = points / users.length;
    const avgPointsPerMatch = avgPoints / avgMatches;
    returnTeams.push({
      createdBy: team.createdBy,
      users,
      points,
      avgMatches,
      avgPoints,
      avgPointsPerMatch,
    });
  }

  returnTeams = returnTeams.sort((a, b) => {
    const aAvgPoints =
      a.users.reduce(reducerPoints, 0) / a.users.reduce(reducerMatches, 0);
    const bAvgPoints =
      b.users.reduce(reducerPoints, 0) / b.users.reduce(reducerMatches, 0);
    return bAvgPoints - aAvgPoints;
  });
  return returnTeams;
}

const reducerPoints = (accumulator: number, currentValue: IUser): number =>
  accumulator + currentValue.stats.customGames.points;
const reducerMatches = (accumulator: number, currentValue: IUser): number =>
  accumulator + currentValue.stats.customGames.matches;
