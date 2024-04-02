// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import ResourceModel, { IResource } from 'db/models/resource_model';
import { BaseError } from 'errors';
import { HydratedDocument } from 'mongoose';
import { removeNull } from 'util/removeNull';

export interface ResourceParams {
  _id?: string;
  title?: string;
  description?: string;
  value?: number;
}

const constructQuery = (params: ResourceParams) => {
  // You would add more here if doing something fancy (ex: range queries)
  const query = {
    ...params,
    _id: params?._id ? new mongoose.Types.ObjectId(params?._id) : null,
  };

  return removeNull(query);
};

const getResources = async (params: ResourceParams): Promise<HydratedDocument<IResource>[]> => {
  const query = constructQuery(params);
  
  try {
    return await ResourceModel.find(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateResource = async (_id: string, params: ResourceParams): Promise<HydratedDocument<IResource>> => {
  const resource = await ResourceModel.findOneAndUpdate({ _id }, params, { new: true });
  if (!resource) throw new DocumentNotFoundError(_id);
  return resource;
};

const deleteResource = async (_id: string): Promise<HydratedDocument<IResource>> => {
  const deletedResource = await ResourceModel.findOneAndDelete({ _id });
  if (!deletedResource) throw new DocumentNotFoundError(_id);
  return deletedResource;
};

const createResource = async (resource: Pick<IResource, 'title' | 'description' | 'value'>): Promise<HydratedDocument<IResource>> => {
  try {
    return await ResourceModel.create({ 
      ...resource, 
      _id: new mongoose.Types.ObjectId(),
    });
  } catch (e : any) {
    throw e;
  }
};

const resourceService = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
};

export default resourceService;
