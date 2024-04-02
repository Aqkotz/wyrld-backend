import bcrypt from 'bcrypt';
import { userService } from 'services';
import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';
import { IUser } from '../../db/models/user_model';
import { SCOPES } from 'auth/scopes';

let idUserA = '';
let idUserB = '';
const invalidId = '365e5281-bbb5-467c-a92d-2f4041828948';

const userDataA: Omit<IUser, 'id'> = {
  email: 'garrygergich@test.com',
  password: 'muncie',
  name: 'Garry Gergich',
  role: SCOPES.USER.name,
};

const userDataB: Omit<IUser, 'id'> = {
  email: 'benwyatt@test.com',
  password: 'icetown',
  name: 'Ben Wyatt',
  role: SCOPES.USER.name,
};

const userDataC: Omit<IUser, 'id'> = {
  email: 'garrygergich2@test.com',
  password: 'muncie',
  name: userDataA.name,
  role: SCOPES.USER.name,
};

describe('userService', () => {
  beforeAll(async () => {
    connectDB();
  });

  afterAll(async () => {
    dropDB();
  });

  describe('createUser', () => {
    it('Can create user A', async () => {
      const user = await userService.createUser(userDataA);

      Object.keys(userDataA)
        .filter((key) => !['password'].includes(key))
        .map((key) => {
          expect(user[key]).toEqual(userDataA[key]);
        });

      const passCompareResult = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(userDataA.password, user.password, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      expect(passCompareResult).toBe(true);
      idUserA = String(user.id);
    });

    it('Rejects if email already used', async () => {
      expect(userService.createUser(userDataA)).rejects.toBeDefined();
    });

    it('Can create user B', async () => {
      const user = await userService.createUser(userDataB);

      Object.keys(userDataB)
        .filter((key) => !['password'].includes(key))
        .map((key) => {
          expect(user[key]).toEqual(userDataB[key]);
        });
      const passCompareResult = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(userDataB.password, user.password, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      expect(passCompareResult).toBe(true);
      idUserB = String(user.id);
    });

    it('Can create user C', async () => {
      const user = await userService.createUser(userDataC);

      Object.keys(userDataC)
        .filter((key) => !['password'].includes(key))
        .map((key) => {
          expect(user[key]).toEqual(userDataC[key]);
        });
      const passCompareResult = await new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(userDataC.password, user.password, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      expect(passCompareResult).toBe(true);
    });
  });

  describe('getUsers', () => {
    it('Can get single user', async () => {
      const user = await userService.getUsers({ id: idUserA })
        .then((res) => res[0])
        .catch(() => undefined);

      expect(user).toBeDefined();

      if (user !== undefined) { // For TypeScript purposes, need to check again
        Object.keys(userDataA)
          .filter((key) => !['password'].includes(key))
          .map((key) => {
            expect(user[key]).toStrictEqual(userDataA[key]);
          });
        expect(user.id.toString()).toStrictEqual(idUserA);
        expect(user.password).not.toBe(userDataA.password);
      }
    });

    it('Returns undefined if no users to get', async () => {
      const user = await userService.getUsers({ id: invalidId })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(user).toBe(undefined);
    });

    it('Gets all users that match filter', async () => {
      const users = await userService.getUsers({ name: userDataA.name });
      expect(users.length).toBe(2);
    });
  });

  describe('updateUser', () => {
    it('Updates user field', async () => {
      const newName = 'Jerry Jones';

      const updatedUser1 = await userService.updateUser(idUserA, { name: newName });
      expect(updatedUser1.name).toBe(newName);

      const updatedUser2 = await userService.getUsers({ id: idUserA })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(updatedUser2?.name).toBe(newName);
    });

    it('Rejects if user does not exist', async () => {
      expect(userService.updateUser(invalidId, { name: 'Larry' })).rejects.toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('Deletes existing user A', async () => {
      await userService.deleteUser(idUserA);
      const user = await userService.getUsers({ id: idUserA })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(user).toBe(undefined);
    });

    it('Deletes existing user B', async () => {
      await userService.deleteUser(idUserB);
      const user = await userService.getUsers({ id: idUserB })
        .then((res) => res[0])
        .catch(() => undefined);
      expect(user).toBe(undefined);
    });

    it('Rejects if user does not exist', async () => {
      expect(userService.deleteUser(invalidId)).rejects.toBeDefined();
    });
  });
});
