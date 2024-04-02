import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IResource } from 'db/models/resource_model';
import { BaseError, getFieldNotFoundError } from 'errors';

export const CreateResourceSchema = joi.object<IResource>({
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
  [ContainerTypes.Body]: IResource
}

export const UpdateResourceSchema = joi.object<IResource>({
  _id: joi.string(),
  title: joi.string(),
  description: joi.string(),
  value: joi.number(),
});

export interface UpdateResourceRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<IResource>
}
