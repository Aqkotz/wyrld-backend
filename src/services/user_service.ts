// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import UserModel, { IUser } from 'db/models/user_model';
import { BaseError } from 'errors';
import { HydratedDocument } from 'mongoose';
import { removeNull } from 'util/removeNull';

export interface UserParams {
  _id?: string;
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

const constructQuery = (params: UserParams) => {
  // You would add more here if doing something fancy (ex: range queries)
  const query = {
    ...params,
    _id: params?._id ? new mongoose.Types.ObjectId(params?._id) : null,
  };

  return removeNull(query);
};

const getUsers = async (params: Omit<UserParams, 'password'>): Promise<HydratedDocument<IUser>[]> => {
  const query = constructQuery(params);

  try {
    return await UserModel.find(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateUser = async (_id: string, params: UserParams): Promise<HydratedDocument<IUser>> => {
  const user = await UserModel.findOneAndUpdate({ _id }, params, { new: true });
  if (!user) throw new DocumentNotFoundError(_id);
  return user;
};

const deleteUser = async (_id: string): Promise<HydratedDocument<IUser>> => {
  const deletedUser = await UserModel.findOneAndDelete({ _id });
  if (!deletedUser) throw new DocumentNotFoundError(_id);
  return deletedUser;
};

const createUser = async (user: Omit<IUser, '_id'>): Promise<HydratedDocument<IUser>> => {
  // check for inactive account with this email
  // db-level unique constraint on email; can assume only one user if any
  const usersSameEmail = await getUsers({
    email: user.email,
  });

  if (usersSameEmail.length == 0) {
    try {
      return await UserModel.create({ 
        ...user, 
        _id: new mongoose.Types.ObjectId(),
      });
    } catch (e : any) {
      throw new BaseError(e.message, 500);
    }
  } else {
    throw new BaseError('Email address already associated to a user', 409);
  }
};

const userService = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};

export default userService;
