import { verificationCodeService, userService } from 'services';
import {
  connectDB, dropDB,
} from '../../../__jest__/helpers';
import { IVerificationCode } from '../../db/models/verification_code_model';
import { IUser } from '../../db/models/user_model';
import { SCOPES } from 'auth/scopes';

const invalidId = '12b1db12e12eb1212a123bd0';

const userData: Omit<IUser, '_id'> = {
  email: 'garrygergich@test.com',
  password: 'muncie',
  name: 'Garry Gergich',
  role: SCOPES.UNVERIFIED.name,
};

const validInput: Pick<IVerificationCode, 'email'> = {
  email: userData.email,
};
const invalidInput: Pick<IVerificationCode, 'email'> = {
  email: 'notvalid@test.com',
};
let oldCode = '';

describe('verificationCodeService', () => {
  beforeAll(async () => {
    connectDB();
    await userService.createUser(userData);
  });

  afterAll(async () => {
    dropDB();
  });

  describe('createVerificationCode', () => {
    it('Can create a verification code', async () => {
      const code = await verificationCodeService.createVerificationCode(validInput);

      expect(code.email).toBe(validInput.email);
      expect(code.code).toBeDefined();
      expect(code.expiration).toBeDefined();

      oldCode = code.code;
    });

    it('Can generate a new, different verification code for the same user', async () => {
      const code = await verificationCodeService.createVerificationCode(validInput);

      expect(code.email).toBe(validInput.email);
      expect(code.code).not.toBe(oldCode);
      expect(code.expiration).toBeDefined();

      oldCode = code.code;
    });
  });

  describe('getVerificationCodes', () => {
    it('Can get code for given email', async () => {
      const code = await verificationCodeService.getVerificationCode(validInput.email);

      expect(code.email).toBe(validInput.email);
      expect(code.code).toBe(oldCode);
      expect(code.expiration).toBeDefined();
    });

    it('Return null if no code found', async () => {
      expect(() => verificationCodeService.getVerificationCode(invalidInput.email)).rejects.toBeDefined();
    });
  });

  describe('verifyVerificationCode', () => {
    it('Rejects if email does not exist', async () => {
      expect(() => verificationCodeService.verifyVerificationCode( 
        invalidInput.email, 
        oldCode,
      )).rejects.toBeDefined();
    });

    it('Rejects if code is wrong', async () => {
      expect(() => verificationCodeService.verifyVerificationCode( 
        validInput.email, 
        'incorrect_code',
      )).rejects.toBeDefined();
    });

    it('Accepts on correct request', async () => {
      const newUser = await verificationCodeService.verifyVerificationCode(
        validInput.email, 
        oldCode,
      );

      Object.keys(userData).forEach((key) => {
        if (key !== 'password' && key !== 'role') {
          expect(newUser[key]).toBe(userData[key]);
        }
      });
      expect(newUser.role).toBe(SCOPES.USER.name);

    });

    it('Rejects if user is verified', async () => {
      expect(() => verificationCodeService.verifyVerificationCode(
        validInput.email, 
        oldCode,
      )).rejects.toBeDefined();
    });
  });

  describe('deleteVerificationCode', () => {
    it('Deletes existing verificationCode', async () => {
      await verificationCodeService.createVerificationCode(validInput);
      await verificationCodeService.deleteVerificationCode(validInput.email);
      expect(verificationCodeService.getVerificationCode(validInput.email)).rejects.toBeDefined();
    });

    it('Rejects if verificationCode does not exist', async () => {
      expect(verificationCodeService.deleteVerificationCode(invalidId)).rejects.toBeDefined();
    });
  });
});