// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import ResourceModel, { IResource } from 'db/models/resource_model';
import { BaseError } from 'errors';
import { HydratedDocument } from 'mongoose';

export interface ResourceParams {
  id?: string;
  title?: string;
  description?: string;
  value?: number;
}

const constructQuery = (params: ResourceParams) => {
  // You would add more here if doing something fancy (ex: range queries)
  return {
    ...params,
  };
};

const getResources = async (params: ResourceParams): Promise<HydratedDocument<IResource>[]> => {
  const query = constructQuery(params);
  
  try {
    return await ResourceModel.find(query);
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateResource = async (id: string, params: ResourceParams): Promise<HydratedDocument<IResource>> => {
  const resource = await ResourceModel.findOneAndUpdate({ id }, params, { new: true });
  if (!resource) throw new DocumentNotFoundError(id);
  return resource;
};

const deleteResource = async (id: string): Promise<HydratedDocument<IResource>> => {
  const deletedResource = await ResourceModel.findOneAndDelete({ id });
  if (!deletedResource) throw new DocumentNotFoundError(id);
  return deletedResource;
};

const createResource = async (resource: Pick<IResource, 'title' | 'description' | 'value'>): Promise<HydratedDocument<IResource>> => {
  try {
    return await ResourceModel.create({ 
      ...resource, 
      id: uuidv4(),
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
