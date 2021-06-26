import { ITeamDocument, ITeamModel } from './teams.types';

export async function createOne(
  this: ITeamModel,
  users: string[],
  createdBy: string,
): Promise<ITeamDocument> {
  for (const user of users) {
    if (await this.findOne({ users: user })) {
      if (user === createdBy)
        throw new Error(
          'You are already in a team, you have to leave it first. `!unreg`',
        );
      throw new Error(`<@${user}> is already registered.`);
    }
  }
  return await this.create({ users, createdBy });
}

export async function findOneByID(
  this: ITeamModel,
  userID: string,
): Promise<ITeamDocument> {
  const user = await this.findOne({ users: userID });
  if (!user) throw new Error('user is not registered.');
  return user;
}
