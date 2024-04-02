// eslint-disable-next-line import/no-extraneous-dependencies
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { BaseError } from 'errors';
import { removeNull } from 'util/removeNull';
import prisma from 'db/prisma_client';
import { User, UserRole } from '@prisma/client';
import prismaExclude from 'util/prismaExclude';

export interface UserParams {
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
}

const constructQuery = (params: UserParams) => {
  return removeNull(params);
};

const getUsers = async (params: Omit<UserParams, 'password'>): Promise<Omit<User, 'password'>[]> => {
  const query = constructQuery(params);

  try {
    return await prisma.user.findMany({
      where: {
        ...query,
      },
      // The above direct object syntax is equivalent to the following dynamic string-based query approach:
      // where: renoveNull({
      //   id: query.id,
      //   email: query.email,
      //   name: query.name
      //   role: query.role,
      // })
      // You will find similar instances of this direct object syntax below in this file as well
      select: prismaExclude('User', ['password']),
      // https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators
      // include
      // take
      // skip
      // orderBy
    });
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateUser = async (id: string, params: UserParams): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.update({
    where: { id: id },
    data: {
      ...params,
    },
    select: prismaExclude('User', ['password']),
  });

  if (!user) throw new DocumentNotFoundError(id);
  return user;
};

const deleteUser = async (id: string): Promise<Omit<User, 'password'>> => {
  const deletedUser = await prisma.user.delete({
    where: {
      id: id,
    },
    select: prismaExclude('User', ['password']),
  });

  if (!deletedUser) throw new DocumentNotFoundError(id);
  return deletedUser;
};

const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<Omit<User, 'password'>> => {
  // check for inactive account with this email
  // db-level unique constraint on email; can assume only one user if any
  const usersSameEmail = await getUsers({
    email: user.email,
  });

  if (usersSameEmail.length == 0) {
    try {
      return await prisma.user.create({
        data: {
          ...user,
        },
        select: prismaExclude('User', ['password']),
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
