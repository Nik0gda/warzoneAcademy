import { Team } from 'discord.js';
import { Schema } from 'mongoose';
import {
  addUser,
  deleteTeam,
  deleteUser,
  isTeamCreator,
} from './teams.methods';

import { createOne, findOneByID } from './teams.statics';

const TeamSchema = new Schema({
  createdBy: String,
  users: [String],
});

TeamSchema.methods.isTeamCreator = isTeamCreator;
TeamSchema.methods.deleteTeam = deleteTeam;
TeamSchema.methods.deleteUser = deleteUser;
TeamSchema.methods.addUser = addUser;

TeamSchema.statics.createOne = createOne;
TeamSchema.statics.findOneByID = findOneByID;

export default TeamSchema;
