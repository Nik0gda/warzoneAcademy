import { Document, Model } from 'mongoose';
import { IUser } from '../users/users.types';
export interface ITeam {
  createdBy: string;
  users: string[];
}

export interface ITeamWIUser {
  createdBy: String;
  users: IUser[];
  points: number;
  avgPoints: number;
  avgMatches: number;
  avgPointsPerMatch: number;
}

export interface ITeamDocument extends ITeam, Document {
  isTeamCreator: (userID: string) => boolean;
  deleteTeam: () => Promise<void>;
  deleteUser: (userID: string) => Promise<ITeamDocument>;
  addUser: (userID: string) => Promise<ITeamDocument>;
}

export interface ITeamModel extends Model<ITeamDocument> {
  createOne: (
    this: ITeamModel,
    users: string[],
    createdBy: string,
  ) => Promise<ITeamDocument>;
  findOneByID: (this: ITeamModel, userID: string) => Promise<ITeamDocument>;
}
