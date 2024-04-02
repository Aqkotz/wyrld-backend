// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import ItemModel, { IItem } from 'db/models/item_model';
import { BaseError } from 'errors';
import { HydratedDocument } from 'mongoose';
import { removeNull } from 'util/removeNull';

export interface ItemParams {
  _id?: string;
  resourceId?: string;
  name?: string;
  description?: string;
}

const constructQuery = (params: ItemParams) => {
  // You would add more here if doing something fancy (ex: range queries)
  const query = {
    ...params,
    _id: params?._id ? new mongoose.Types.ObjectId(params?._id) : null,
    resourceId: params?.resourceId ? new mongoose.Types.ObjectId(params?.resourceId) : null,
  };

  return removeNull(query);
};

const getItems = async (params: ItemParams): Promise<HydratedDocument<IItem>[]> => {
  const query = constructQuery(params);
  
  try {
    return await ItemModel.find(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateItem = async (_id: string, params: ItemParams): Promise<HydratedDocument<IItem>> => {
  const item = await ItemModel.findOneAndUpdate({ _id }, params, { new: true });
  if (!item) throw new DocumentNotFoundError(_id);
  return item;
};

const deleteItem = async (_id: string): Promise<HydratedDocument<IItem>> => {
  const deletedItem = await ItemModel.findOneAndDelete({ _id });
  if (!deletedItem) throw new DocumentNotFoundError(_id);
  return deletedItem;
};

const createItem = async (item: ItemParams | Omit<IItem, '_id'>): Promise<HydratedDocument<IItem>> => {
  try {
    return await ItemModel.create({ 
      ...item, 
      _id: new mongoose.Types.ObjectId(),
    });
  } catch (e : any) {
    throw e;
  }
};

const itemService = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};

export default itemService;