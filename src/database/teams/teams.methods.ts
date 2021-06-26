import { Document } from 'mongoose';
import { ITeamDocument } from './teams.types';

export function isTeamCreator(this: ITeamDocument, userID: string): boolean {
  return this.createdBy === userID;
}

export async function deleteTeam(this: ITeamDocument): Promise<void> {
  await this.remove();
  return;
}

export async function deleteUser(
  this: ITeamDocument,
  userID: string,
): Promise<ITeamDocument> {
  this.users = this.users.filter((id) => id !== userID);
  return this.save();
}

export async function addUser(
  this: ITeamDocument,
  userID: string,
): Promise<ITeamDocument> {
  if (this.users.includes(userID)) return this;
  this.users.push(userID);
  await this.save();
  return this;
}
