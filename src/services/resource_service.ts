// eslint-disable-next-line import/no-extraneous-dependencies
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { BaseError } from 'errors';
import { removeNull } from 'util/removeNull';
import prisma from 'db/prisma_client';
import { Resource } from '@prisma/client';

export interface ResourceParams {
  id?: string;
  title?: string;
  description?: string;
  value?: number;
}

const constructQuery = (params: ResourceParams) => {
  return removeNull(params);
};

const getResources = async (params: ResourceParams): Promise<Resource[]> => {
  const query = constructQuery(params);
  
  try {
    return await prisma.resource.findMany({
      where: {
        ...query,
      },
      // The above direct object syntax is equivalent to the following dynamic string-based query approach:
      // where: removeNull({
      //   id: query.id,
      //   title: query.title,
      //   description: query.description,
      //   value: query.value
      // })
      // You will find similar instances of this direct object syntax below in this file as well
      
      // https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators
      // include
      // take
      // skip
      // orderBy
    });
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

// This method isn't connected elsewhere for now,
// but serves as an example of some more advanced filtering + sorting
const exampleQueryResources = async (): Promise<Resource[]> => {
  try {
    return await prisma.resource.findMany({
      // https://www.prisma.io/docs/orm/prisma-client/queries/pagination
      skip: 1,
      take: 2,
      // Pagination can also be implemented through cursors
      // See https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination

      where: {
        title: {
          startsWith: 'A',
        },
        value: {
          gt: 5,
        },
      },
      orderBy: {
        title: 'desc',
      },
    });
  } catch (e : any) {
    throw new BaseError(e.message, 500);
  }
};

const updateResource = async (id: string, params: ResourceParams): Promise<Resource> => {
  const resource = await prisma.resource.update({
    where: { id: id },
    data: {
      ...params,
    },
  });

  if (!resource) throw new DocumentNotFoundError(id);
  return resource;
};

const deleteResource = async (id: string): Promise<Resource> => {
  const deletedResource = await prisma.resource.delete({
    where: {
      id: id,
    },
  });

  if (!deletedResource) throw new DocumentNotFoundError(id);
  return deletedResource;
};

const createResource = async (resource: Pick<Resource, 'title' | 'description' | 'value'>): Promise<Resource> => {
  try {
    return await prisma.resource.create({
      data: {
        ...resource,
      },
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
