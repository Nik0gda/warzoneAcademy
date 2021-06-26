import { IUserDocument, IUserModel } from './users.types';
export async function findOneObject(
  this: IUserModel,
  dID: string,
): Promise<IUserDocument> {
  const record = await this.findOne({ dID });
  if (!record) {
    throw new Error('No user found with specified discord ID');
  }
  return record;
}

export async function findOrCreateOne(
  this: IUserModel,
  dID: string,
): Promise<IUserDocument> {
  const record = await this.findOne({ dID });
  if (record) {
    return record;
  } else {
    return await this.create({ dID, dateOfEntry: new Date() });
  }
}
