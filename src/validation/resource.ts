import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { Resource } from '@prisma/client';
import { BaseError, getFieldNotFoundError } from 'errors';

export const CreateResourceSchema = joi.object<Resource>({
  title: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('title'), 400);
  }),
  description: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('description'), 400);
  }),
  value: joi.number().required().error(() => {
    throw new BaseError(getFieldNotFoundError('value'), 400);
  }),
});

export interface CreateResourceRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Resource
}

export const UpdateResourceSchema = joi.object<Resource>({
  id: joi.string(),
  title: joi.string(),
  description: joi.string(),
  value: joi.number(),
});

export interface UpdateResourceRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<Resource>
}
