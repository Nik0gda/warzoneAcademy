import { Schema } from 'mongoose';

import {
  updateStats,
  setLastUpdated,
  updateActivisionID,
  isRegistered,
  getStats,
} from './users.methods';
import { findOneObject, findOrCreateOne } from './users.statics';

const UserSchema = new Schema({
  dID: String,
  tag: String,
  dateOfEntry: {
    type: Date,
    default: new Date(),
  },
  dateOfExit: Date,
  lastUpdated: {
    type: Date,
    default: new Date(),
  },
  stats: {
    id: String,
    customGames: {
      matches: Number,
      points: Number,
      wins: Number,
    },
  },
});

UserSchema.statics.findOneObject = findOneObject;
UserSchema.statics.findOrCreateOne = findOrCreateOne;

UserSchema.methods.getStats = getStats;
UserSchema.methods.updateActivisionID = updateActivisionID;
UserSchema.methods.updateStats = updateStats;
UserSchema.methods.setLastUpdated = setLastUpdated;
UserSchema.methods.isRegistered = isRegistered;

export default UserSchema;
