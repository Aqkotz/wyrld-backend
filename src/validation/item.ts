import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { IItem } from 'db/models/item_model';
import { BaseError, getFieldNotFoundError } from 'errors';

export const CreateItemSchema = joi.object<Omit<IItem, '_id'>>({
  resourceId: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('resourceId'), 400);
  }),
  name: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('title'), 400);
  }),
  description: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('description'), 400);
  }),
});

export interface CreateItemRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<IItem, '_id'>
}

export const UpdateItemSchema = joi.object<Omit<IItem, '_id' | 'resourceId'>>({
  name: joi.string(),
  description: joi.string(),
});

export interface UpdateItemRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<Omit<IItem, '_id'>>
}
