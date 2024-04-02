import supertest from 'supertest';

import authRouter from 'routers/auth_router';
import { userService } from 'services';
import { connectDB, dropDB } from '../../../__jest__/helpers';
import { IUser } from 'db/models/user_model';

const request = supertest(authRouter);

// Mocks requireAuth server middleware
jest.mock('../../auth/requireAuth');
jest.mock('../../auth/requireScope');
jest.mock('../../auth/requireSelf');

const mockUser: Omit<IUser, 'id' | 'role'> = {
  email: 'test@test.com',
  password: 'password',
  name: 'Joe Smith',
};

// let userId  = '';
// let code = '';

describe('Working auth router', () => {
  beforeAll(async () => {
    connectDB();
  });

  afterAll(async () => {
    dropDB();
  });

  describe('POST /logout', () => {
    it('logs out', async () => {
      const res = await request.post('/logout');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /signup', () => {
    it('blocks creation when missing field', async () => {
      const createSpy = jest.spyOn(userService, 'createUser');

      const attempts = Object.keys(mockUser).map(async (key) => {
        const user = { ...mockUser };
        delete user[key];

        const res = await request
          .post('/signup')
          .send(user);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });

      await Promise.all(attempts);
    });

    it('blocks creation when field invalid', async () => {
      const createSpy = jest.spyOn(userService, 'createUser');

      const attempts = Object.keys(mockUser).map(async (key) => {
        const User = { ...mockUser };
        User[key] = typeof User[key] === 'number'
          ? 'some string'
          : 0;

        const res = await request
          .post('/signup')
          .send(User);

        expect(res.status).toBe(400);
        expect(res.body.errors.length).toBe(1);
        expect(createSpy).not.toHaveBeenCalled();
      });

      await Promise.all(attempts);
    });

    it('creates user when body is valid', async () => {
      const createSpy = jest.spyOn(userService, 'createUser');

      const res = await request
        .post('/signup')
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      Object.keys(mockUser)
        .filter((key) => key !== 'password')
        .forEach((key) => {
          expect(res.body.user[key]).toBe(mockUser[key]);
        });

      expect(createSpy).toHaveBeenCalled();
      createSpy.mockClear();
    });
  });

  describe('POST /signin', () => {
    it('rejects requests without both email and password', async () => {
      const attempts = ['email', 'password', ''].map(async (key) => {
        const user = key
          ? { [key]: mockUser[key] }
          : {};

        const res = await request
          .post('/signin')
          .send(user);

        expect(res.status).toBe(400);
      });

      await Promise.all(attempts);
    });

    it('rejects emails with no associated users', async () => {
      const res = await request
        .post('/signin')
        .send({ email: 'not an email', password: mockUser.password });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Email address not associated with a user');
    });

    it('returns 401 on incorrect password', async () => {
      const res = await request
        .post('/signin')
        .send({ email: mockUser.email, password: 'wrong password' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect password');
    });

    it('returns valid token and JSON user object', async () => {
      const res = await request.post('/signin').send(mockUser);
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      Object.keys(mockUser)
        .filter((key) => key !== 'password')
        .forEach((key) => {
          expect(res.body.user[key]).toBe(mockUser[key]);
        });
    });
  });

  describe('GET /jwt-signin', () => {
    it('requires jwt token', async () => {
      const res = await request.get('/jwt-signin');
      expect(res.status).toBe(401);
    });

    it('sends user JSON corresponding to jwt', async () => {
      const res = await request
        .get('/jwt-signin')
        .set('Authorization', 'Bearer dummy_token');

      expect(res.status).toBe(200);
      Object.keys(mockUser)
        .filter((key) => key !== 'password')
        .forEach((key) => {
          expect(res.body.user[key]).toBe(mockUser[key]);
        });
    });
  });
});
