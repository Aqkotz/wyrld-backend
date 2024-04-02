import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IUser } from 'db/models/user_model';
import { IVerificationCode } from 'db/models/verification_code_model';
import { BaseError, getFieldNotFoundError } from 'errors';

export const SignUpUserSchema = joi.object<IUser>({
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

export const ResendCodeSchema = joi.object<Pick<IUser, '_id' | 'email'>>({
  _id: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('id'), 400);
  }),
  email: joi.string().email().required().error(() => {
    throw new BaseError(getFieldNotFoundError('email'), 400);
  }),
});

export const VerifyUserSchema = joi.object<Pick<IUser, '_id' | 'email'> & Pick<IVerificationCode, 'code'>>({
  _id: joi.string().required().error(() => {
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
  [ContainerTypes.Body]: IUser
}

export interface ResendCodeRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Pick<IUser, '_id' | 'email'>
}

export interface VerifyUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Pick<IUser, '_id' | 'email'> & Pick<IVerificationCode, 'code'>
}
