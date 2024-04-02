/* eslint-disable @typescript-eslint/naming-convention */
import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseError } from 'errors';
import { getSuccessfulDeletionMessage } from 'util/constants';
import { userService } from 'services';
import { CreateUserRequest, UpdateUserRequest } from 'validation/users';
import { SCOPES } from 'auth/scopes';

const createUser: RequestHandler = async (req: ValidatedRequest<CreateUserRequest>, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;

    const newUser = await userService.createUser({
      email,
      password,
      name,
      role: SCOPES.USER.name,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.getUsers({
      ...req.query,
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUser: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.getUsers({
      id: req.params.id,
      ...req.query,
    });
    if (users.length === 0) throw new BaseError('User not found', 404);
    else if (users.length > 1) throw new BaseError('Multiple User entries found', 404);
    else res.status(200).json(users[0]);
  } catch (error) {
    next(error);
  }
};


const updateUser: RequestHandler = async (req: ValidatedRequest<UpdateUserRequest>, res, next) => {
  try {
    // ! Only allow user to update certain fields (avoids privilege elevation)
    const { name, email } = req.body;
    const updatedUser = await userService.updateUser(
      req.params.id,
      { name, email },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
