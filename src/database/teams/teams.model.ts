import { model } from 'mongoose';
import { ITeamDocument, ITeamModel } from './teams.types';
import TeamSchema from './teams.schema';
export const TeamModel = model<ITeamDocument, ITeamModel>('teams', TeamSchema);
