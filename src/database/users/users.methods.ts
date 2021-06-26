import { Document } from 'mongoose';
import { dbStats } from '../../../types';
import { IUserDocument, IUserModel } from './users.types';

export async function updateStats(
  this: IUserDocument,
  stats: dbStats,
): Promise<void> {
  await this.setLastUpdated();
  this.stats = stats;
  await this.save();
}

export async function updateActivisionID(
  this: IUserDocument,
  platformIdentifier: string,
): Promise<Document> {
  await this.setLastUpdated();
  this.stats.id = platformIdentifier;
  return await this.save();
}

export async function setLastUpdated(this: IUserDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    await this.save();
  }
}

export async function getStats(this: IUserDocument): Promise<dbStats> {
  console.log(this.stats.customGames.matches);
  if (!this.stats.customGames.matches) {
    this.stats.customGames = {
      matches: 0,
      points: 0,
      wins: 0,
    };
    await this.save();
  }
  return this.stats;
}

export function isRegistered(this: IUserDocument): boolean {
  return this.stats.id ? true : false;
}
