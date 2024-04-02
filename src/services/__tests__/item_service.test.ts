import { resourceService, itemService } from 'services';
import { IResource } from 'db/models/resource_model';
import { ItemParams } from 'services/item_service';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

let idItemA = '';
const invalidId = 'invalidId';

const resourceData: Omit<IResource, '_id'> = {
  title: 'Flu Season',
  description: 'Leslie comes down with the flu while planning the local Harvest Festival; Andy and Ron bond.',
  value: 32,
};

const itemDataA: Omit<ItemParams, '_id'> = {
  resourceId: '',
  name: 'Item Name A',
  description: 'Description Name A',
};

const itemDataB: Omit<ItemParams, '_id'>  = {
  resourceId: '',
  name: 'Item Name B',
  description: 'Description Name B',
};

describe('itemService', () => {
  beforeAll(async () => {
    connectDB();
    await resourceService.createResource(resourceData).then((resource) => {
      itemDataA.resourceId = resource._id.toString();
      itemDataB.resourceId = resource._id.toString();
    });
  });

  afterAll(async () => {
    dropDB();
  });

  describe('createItem', () => {
    it('Can create item', async () => {
      const item = await itemService.createItem(itemDataA);
      
      Object.keys(itemDataA)
        // .filter((key) => key)
        .map((key) => {
          if (['resourceId'].includes(key)) {
            expect(item[key].toString()).toEqual(itemDataA[key]);
          } else {
            expect(item[key]).toEqual(itemDataA[key]);

          }
        });
      expect(item._id).toBeDefined();
      idItemA = String(item._id);
    });

    it('Can create second item', async () => {
      const item = await itemService.createItem(itemDataB);
      
      Object.keys(itemDataB)
        // .filter((key) => key)
        .map((key) => {
          if (['resourceId'].includes(key)) {
            expect(item[key].toString()).toEqual(itemDataB[key]);
          } else {
            expect(item[key]).toEqual(itemDataB[key]);

          }
        });
      expect(item._id).toBeDefined();
    });
  });

  describe('getItems', () => {
    it('Can get item', async () => {
      const item = await itemService.getItems({ _id: idItemA })
        .then((res) => res[0])
        .catch(() => undefined);

      if (item !== undefined) { // For TypeScript purposes, need to check again
        Object.keys(itemDataA)
        // .filter((key) => key)
          .map((key) => {
            if (['resourceId'].includes(key)) {
              expect(item[key].toString()).toEqual(itemDataA[key]);
            } else {
              expect(item[key]).toEqual(itemDataA[key]);

            }
          });
      }
    });

    it('Rejects if item does not exist', async () => {
      const item = await itemService.getItems({ _id : invalidId })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(item).toBe(undefined);
    });
  });

  describe('updateItem', () => {
    const newTestType = 'IB';
    
    it('Updates name field, returns updated item', async () => {
      const updatedItem1 = await itemService.updateItem(idItemA, { name: newTestType });
      expect(updatedItem1.name).toBe(newTestType);

      const updatedItem2 = await itemService.getItems({ _id: idItemA })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(updatedItem2?.name).toBe(newTestType);
    });

    it('Rejects if item does not exist', async () => {
      expect(itemService.updateItem(invalidId, { name: '10000' })).rejects.toBeDefined();
    });
  });

  describe('deleteItem', () => {
    it('Deletes existing item', async () => {
      await itemService.deleteItem(idItemA);
      const item = await itemService.getItems({ _id: idItemA })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(item).toBe(undefined);
    });

    it('Rejects if item does not exist', async () => {
      expect(itemService.deleteItem(invalidId)).rejects.toBeDefined();
    });
  });
});
