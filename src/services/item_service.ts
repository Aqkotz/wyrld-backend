// eslint-disable-next-line import/no-extraneous-dependencies
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { BaseError } from 'errors';
import { removeNull } from 'util/removeNull';

import prisma from 'db/prisma_client';
import { Item } from '@prisma/client';

export interface ItemParams {
  id?: string;
  resourceId?: string;
  name?: string;
  description?: string;
}

const constructQuery = (params: ItemParams) => {
  return removeNull(params);
};

const getItems = async (params: ItemParams): Promise<Item[]> => {
  const query = constructQuery(params);
  
  try {
    return await prisma.item.findMany({
      where: {
        ...query,
      },
      // The above direct object syntax is equivalent to the following dynamic string-based query approach:
      // where: removeNull({
      //   id: query.id,
      //   resourceId: query.resourceId,
      //   name: query.name
      //   description: query.description,
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

const updateItem = async (id: string, params: ItemParams): Promise<Item> => {
  const item = await prisma.item.update({
    where: { id },
    data: {
      ...params,
    },
  });

  if (!item) throw new DocumentNotFoundError(id);
  return item;
};

const deleteItem = async (id: string): Promise<Item> => {
  const deletedItem = await prisma.item.delete({
    where: {
      id: id,
    },
  });

  if (!deletedItem) throw new DocumentNotFoundError(id);
  return deletedItem;
};

const createItem = async (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
  try {
    return await prisma.item.create({
      data: {
        ...item,
      },
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