import supertest from 'supertest';
import { connectDB, dropDB } from '../../../__jest__/helpers';
import resourceRouter from 'routers/resource_router';
import { resourceService } from 'services';
import { IResource } from 'db/models/resource_model';

const request = supertest(resourceRouter);

const resourceDataA: Omit<IResource, '_id'> = {
  title: 'Flu Season',
  description: 'Leslie comes down with the flu while planning the local Harvest Festival; Andy and Ron bond.',
  value: 32,
};

const resourceDataB: Omit<IResource, '_id'> = {
  title: 'Time Capsule',
  description: 'Leslie plans to bury a time capsule that summarizes life in Pawnee; Andy asks Chris for help.',
  value: 33,
};

let idResourceA = '';
const invalidId = '12b1db12e12eb1212a123bd0';

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireSelf');

describe('Working resource router', () => {
  beforeAll(async () => {
    connectDB();
  });

  afterAll(async () => {
    dropDB();
  });

  describe('POST /', () => {
    it('requires valid permissions', async () => {
      const createSpy = jest.spyOn(resourceService, 'createResource');

      const res = await request
        .post('/')
        .send(resourceDataA);

      expect(res.status).toBe(403);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(resourceService, 'createResource');

      const attempts = Object.keys(resourceDataA).map(async (key) => {
        const resource = { ...resourceDataA };
        delete resource[key];

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(resource);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(resourceService, 'createResource');

      const attempts = Object.keys(resourceDataA).map(async (key) => {
        const resource = { ...resourceDataA };
        resource[key] = typeof resource[key] === 'number'
          ? 'some string'
          : 0;

        const res = await request
          .post('/')
          .set('Authorization', 'Bearer dummy_token')
          .send(resource);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('creates resource when body is valid', async () => {
      const createSpy = jest.spyOn(resourceService, 'createResource');

      const res = await request
        .post('/')
        .set('Authorization', 'Bearer dummy_token')
        .send(resourceDataA);

      expect(res.status).toBe(201);
      Object.keys(resourceDataA).forEach((key) => {
        expect(res.body[key]).toBe(resourceDataA[key]);
      });
      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();

      idResourceA = String(res.body._id);
    });
  });

  describe('GET /?...=...', () => {
    it('requires valid permissions', async () => {
      const getManySpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get('/')
        .send(resourceDataA);

      expect(res.status).toBe(403);
      expect(getManySpy).not.toHaveBeenCalled();
    });

    it('returns empty array if no resources found', async () => {
      const getSpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get(`/?title=${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      getSpy.mockClear();
    });

    it('returns resources by query', async () => {
      const getSpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get(`/?title=${resourceDataA.title}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);

      Object.keys(resourceDataA)
        // .filter((key) => key)
        .map((key) => {
          expect(res.body[0][key]).toEqual(resourceDataA[key]);
        });
      expect(res.body[0]._id).toBeDefined();
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('GET /:_id?...=...', () => {
    it('requires valid permissions', async () => {
      const getSpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get(`/${idResourceA}`)
        .send(resourceDataA);

      expect(res.status).toBe(403);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it('returns 404 when resource not found', async () => {
      const getSpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      getSpy.mockClear();
    });

    it('returns single resource if found - generic', async () => {
      const getSpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get(`/${idResourceA}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);

      Object.keys(resourceDataA)
        // .filter((key) => key)
        .map((key) => {
          expect(res.body[key]).toEqual(resourceDataA[key]);
        });
      expect(res.body._id).toBeDefined();
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });

    it('returns single resource if found - specific query', async () => {
      const getSpy = jest.spyOn(resourceService, 'getResources');

      const res = await request
        .get(`/${idResourceA}?title=${resourceDataA.title}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(resourceDataA)
        // .filter((key) => key)
        .map((key) => {
          expect(res.body[key]).toEqual(resourceDataA[key]);
        });
      expect(res.body._id).toBeDefined();
      expect(getSpy).toHaveBeenCalled();
      getSpy.mockClear();
    });
  });

  describe('PATCH /:_id', () => {
    it('requires valid permissions', async () => {
      const updateSpy = jest.spyOn(resourceService, 'updateResource');

      const res = await request
        .patch(`/${idResourceA}`)
        .send({ title: '#ffffff' });

      expect(res.status).toBe(403);
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if resource not found', async () => {
      const updateSpy = jest.spyOn(resourceService, 'updateResource');

      const res = await request
        .patch(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token')
        .send({ title: '#ffffff' });

      expect(res.status).toBe(404);
      expect(updateSpy).rejects.toThrowError();
      updateSpy.mockClear();
    });

    it('blocks creation when field invalid', async () => {
      const updateSpy = jest.spyOn(resourceService, 'updateResource');

      const attempts = Object.keys(resourceDataA).concat('otherkey').map(async (key) => {
        const ResourceUpdate = {
          [key]: typeof resourceDataA[key] === 'number'
            ? 'some string'
            : 0,
        };
  
        const res = await request
          .patch(`/${idResourceA}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(ResourceUpdate);
  
        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(updateSpy).not.toHaveBeenCalled();
      });
      await Promise.all(attempts);
    });

    it('updates resource when body is valid', async () => {
      const updateSpy = jest.spyOn(resourceService, 'updateResource');

      const attempts = Object.keys(resourceDataB).map(async (key) => {
        const resourceUpdate = { [key]: resourceDataB[key] };

        const res = await request
          .patch(`/${idResourceA}`)
          .set('Authorization', 'Bearer dummy_token')
          .send(resourceUpdate);
  
        expect(res.status).toBe(200);
        expect(res.body[key]).toStrictEqual(resourceDataB[key]);
      });
      await Promise.all(attempts);

      expect(updateSpy).toHaveBeenCalledTimes(Object.keys(resourceDataB).length);
      updateSpy.mockClear();

      const res = await request
        .get(`/${idResourceA}`)
        .set('Authorization', 'Bearer dummy_token');

      Object.keys(resourceDataB)
        // .filter((key) => key)
        .map((key) => {
          expect(res.body[key]).toEqual(resourceDataB[key]);
        });
    });
  });

  describe('DELETE /:_id', () => {
    it('requires valid permissions', async () => {
      const deleteSpy = jest.spyOn(resourceService, 'deleteResource');

      const res = await request.delete(`/${idResourceA}`);

      expect(res.status).toBe(403);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('returns 404 if resource not found', async () => {
      const deleteSpy = jest.spyOn(resourceService, 'deleteResource');

      const res = await request
        .delete(`/${invalidId}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(404);
      expect(deleteSpy).rejects.toThrowError();
      deleteSpy.mockClear();
    });

    it('deletes resource', async () => {
      const deleteSpy = jest.spyOn(resourceService, 'deleteResource');

      const res = await request
        .delete(`/${idResourceA}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      expect(deleteSpy).toHaveBeenCalled();
      deleteSpy.mockClear();

      const getRes = await request
        .get(`/${idResourceA}`)
        .set('Authorization', 'Bearer dummy_token');

      expect(getRes.status).toBe(404);
    });
  });
});
