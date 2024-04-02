import supertest from 'supertest';
import { connectDB, dropDB } from '../../../__jest__/helpers';
import itemRouter from 'routers/item_router';
import { itemService, resourceService } from 'services';
import { IResource } from '../../db/models/resource_model';
import { ItemParams } from 'services/item_service';

const request = supertest(itemRouter);

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


let idItemA = '';
const invalidId = '12b1db12e12eb1212a123bd0';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireSelf');

describe('Working item router', () => {
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

  describe('POST /', () => {
    it('requires valid permissions', async () => {
      const createSpy = jest.spyOn(itemService, 'createItem');

      const res = await request
        .post('/')
        .send(itemDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    // it('blocks creation when missing field', async () => {
    //   const createSpy = jest.spyOn(itemService, 'createItem');

    //   const attempts = Object.keys(itemDataA).map(async (key) => {
    //     const item = { ...itemDataA };
    //     delete item[key];

    //     const res = await request
    //       .post('/')
    //       .set('Authorization', 'Bearer dummy_token')
    //       .send(item);

    //     expect(res.status).toBe(400);
    //     expect(res.body.errors.length).toBe(1);
    //     expect(createSpy).not.toHaveBeenCalled();
    //   });
    //   await Promise.all(attempts);
    // });

    it('creates item when body is valid', async () => {
      const createSpy = jest.spyOn(itemService, 'createItem');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(itemDataA);

      expect(res.status).toBe(201);
      Object.keys(itemDataA).forEach((key) => {
        expect(res.body[key]).toBe(itemDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      idItemA = String(res.body._id);
    });
  });

  describe('GET /?...=...', () => {
    it('requires valid permissions', async () => {
      const getManySpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get('/')
        .send(itemDataA);

      expect(res.status).toBe(403);
      expect(getManySpy).not.toHaveBeenCalled();
    });

    it('returns empty array if no items found', async () => {
      const getSpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get(`/?name=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      getSpy.mockClear();
    });

    it('returns items by query', async () => {
      const getSpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get(`/?name=${itemDataA.name}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);

      Object.keys(itemDataA).forEach((key) => {
        expect(res.body[0][key]).toBe(itemDataA[key]);
      });
      expect(res.body[0]._id).toBeDefined();
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('GET /:_id?...=...', () => {
    it('requires valid permissions', async () => {
      const getSpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get(`/${idItemA}`)
        .send(itemDataA);

      expect(res.status).toBe(403);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it('returns 404 when item not found', async () => {
      const getSpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      getSpy.mockClear();
    });

    it('returns single item if found - generic', async () => {
      const getSpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get(`/${idItemA}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);

      Object.keys(itemDataA).forEach((key) => {
        expect(res.body[key]).toBe(itemDataA[key]);
      });
      expect(res.body._id).toBeDefined();
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single item if found - specific query', async () => {
      const getSpy = jest.spyOn(itemService, 'getItems');

      const res = await request
        .get(`/${idItemA}?name=${itemDataA.name}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(itemDataA).forEach((key) => {
        expect(res.body[key]).toBe(itemDataA[key]);
      });
      expect(res.body._id).toBeDefined();
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:_id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(itemService, 'updateItem');

      const res = await request
        .patch(`/${idItemA}`)
        .send({ name: '#ffffff' });

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if item not found', async () => {
      const updateSpy = jest.spyOn(itemService, 'updateItem');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ name: '#ffffff' });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('blocks creation when field invalid', async () => {
      const updateSpy = jest.spyOn(itemService, 'updateItem');

      const attempts = Object.keys(itemDataA).concat('otherkey').filter((key) => !['resourceId'].includes(key)).map(async (key) => {
        const ItemUpdate = {
          [key]: typeof itemDataA[key] === 'number'
            ? 'some string'
            : 0,
        };
  
        const res = await request
          .patch(`/${idItemA}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(ItemUpdate);
  
        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('updates item when body is valid', async () => {
      const updateSpy = jest.spyOn(itemService, 'updateItem');

      const attempts = Object.keys(itemDataB).filter((key) => !['resourceId'].includes(key)).map(async (key) => {
        const itemUpdate = { [key]: itemDataB[key] };

        const res = await request
          .patch(`/${idItemA}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(itemUpdate);
  
        expect(res.status).toBe(200);
        expect(res.body[key]).toBe(itemDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(itemDataB).length - 1);
      updateSpy.mockClear();

      const res = await request
        .get(`/${idItemA}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(itemDataB).forEach((key) => {
        expect(res.body[key]).toBe(itemDataB[key]);
      });
    });
  });

  describe('DELETE /:_id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(itemService, 'deleteItem');

      const res = await request.delete(`/${idItemA}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if item not found', async () => {
      const deleteSpy = jest.spyOn(itemService, 'deleteItem');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes item', async () => {
      const deleteSpy = jest.spyOn(itemService, 'deleteItem');

      const res = await request
        .delete(`/${idItemA}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(deleteSpy).toHaveBeenCalled();
      deleteSpy.mockClear();

      const getRes = await request
        .get(`/${idItemA}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(getRes.status).toBe(404);
    });
  });
});
