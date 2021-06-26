import { Document, Model } from 'mongoose';
import { dbStats } from '../../../types';
export interface IUser {
  dID: string;
  dateOfEntry: Date;
  dateOfExit?: Date;
  lastUpdated?: Date;
  stats?: dbStats;
}
export interface IUserDocument extends IUser, Document {
  updateStats: (stats: dbStats) => Promise<void>;
  updateActivisionID: (activisionID: string) => Promise<Document>;
  getStats: () => Promise<dbStats>;
  setLastUpdated: (this: IUserDocument) => Promise<void>;
  isRegistered: (this: IUserDocument) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  findOneObject: (this: IUserModel, dID: string) => Promise<IUserDocument>;
  findOrCreateOne: (this: IUserModel, dID: string) => Promise<IUserDocument>;
}
