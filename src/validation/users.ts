import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { User } from '@prisma/client';
import { BaseError, getFieldNotFoundError } from 'errors';

export const CreateUserSchema = joi.object<User>({
  email: joi.string().email().required().error(() => {
    throw new BaseError(getFieldNotFoundError('email'), 400);
  }),
  password: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('password'), 400);
  }),
  name: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('name'), 400);
  }),
});

export interface CreateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: User
}

export const UpdateUserSchema = joi.object<User>({
  email: joi.string().email(),
  password: joi.string(),
  name: joi.string(),
});

export interface UpdateUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<User>
}
