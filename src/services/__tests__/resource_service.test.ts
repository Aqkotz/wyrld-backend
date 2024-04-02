import { resourceService } from 'services';
import { IResource } from '../../db/models/resource_model';

import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';

let idResourceA = '';
const invalidId = 'invalidId';

const resourceDataA: Omit<IResource, 'id'> = {
  title: 'Flu Season',
  description: 'Leslie comes down with the flu while planning the local Harvest Festival; Andy and Ron bond.',
  value: 32,
};

const resourceDataB: Omit<IResource, 'id'>  = {
  title: 'Time Capsule',
  description: 'Leslie plans to bury a time capsule that summarizes life in Pawnee; Andy asks Chris for help.',
  value: 33,
};

describe('resourceService', () => {
  beforeAll(async () => {
    connectDB();
  });

  afterAll(async () => {
    dropDB();
  });

  describe('createResource', () => {
    it('Can create resource', async () => {
      const resource = await resourceService.createResource(resourceDataA);
      
      Object.keys(resourceDataA)
        // .filter((key) => key)
        .map((key) => {
          expect(resource[key]).toEqual(resourceDataA[key]);
        });
      expect(resource.id).toBeDefined();
      idResourceA = String(resource.id);
    });

    it('Can create second resource', async () => {
      const resource = await resourceService.createResource(resourceDataB);
      
      Object.keys(resourceDataB)
        // .filter((key) => key)
        .map((key) => {
          expect(resource[key]).toEqual(resourceDataB[key]);
        });
      expect(resource.id).toBeDefined();
    });
  });

  describe('getResources', () => {
    it('Can get resource', async () => {
      const resource = await resourceService.getResources({ id: idResourceA })
        .then((res) => res[0])
        .catch(() => undefined);

      if (resource !== undefined) { // For TypeScript purposes, need to check again
        Object.keys(resourceDataA)
        // .filter((key) => key)
          .map((key) => {
            expect(resource[key]).toEqual(resourceDataA[key]);
          });
      }
    });

    it('Rejects if resource does not exist', async () => {
      const resource = await resourceService.getResources({ id : invalidId })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(resource).toBe(undefined);
    });
  });

  describe('updateResource', () => {
    const newDescription = 'Test description';
    
    it('Updates resource field, returns updated resource', async () => {
      const updatedResource1 = await resourceService.updateResource(idResourceA, { description: newDescription });
      expect(updatedResource1.description).toBe(newDescription);

      const updatedResource2 = await resourceService.getResources({ id: idResourceA })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(updatedResource2?.description).toBe(newDescription);
    });

    it('Rejects if resource does not exist', async () => {
      expect(resourceService.updateResource(invalidId, { title: '10000' })).rejects.toBeDefined();
    });
  });

  describe('deleteResource', () => {
    it('Deletes existing resource', async () => {
      await resourceService.deleteResource(idResourceA);
      const resource = await resourceService.getResources({ id: idResourceA })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(resource).toBe(undefined);
    });

    it('Rejects if resource does not exist', async () => {
      expect(resourceService.deleteResource(invalidId)).rejects.toBeDefined();
    });
  });
});
