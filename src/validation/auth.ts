import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { User, VerificationCode } from '@prisma/client';
import { BaseError, getFieldNotFoundError } from 'errors';

export const SignUpUserSchema = joi.object<User>({
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

export const ResendCodeSchema = joi.object<Pick<User, 'id' | 'email'>>({
  id: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('id'), 400);
  }),
  email: joi.string().email().required().error(() => {
    throw new BaseError(getFieldNotFoundError('email'), 400);
  }),
});

export const VerifyUserSchema = joi.object<Pick<User, 'id' | 'email'> & Pick<VerificationCode, 'code'>>({
  id: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('id'), 400);
  }),
  email: joi.string().email().required().error(() => {
    throw new BaseError(getFieldNotFoundError('email'), 400);
  }),
  code: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('code'), 400);
  }),
});

export interface SignUpUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: User
}

export interface ResendCodeRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Pick<User, 'id' | 'email'>
}

export interface VerifyUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Pick<User, 'id' | 'email'> & Pick<VerificationCode, 'code'>
}
