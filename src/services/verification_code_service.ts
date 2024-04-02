import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import VerificationCodeModel, { IVerificationCode } from 'db/models/verification_code_model';
import UserModel, { IUser } from 'db/models/user_model';
import { BaseError } from 'errors';
import { HydratedDocument } from 'mongoose';
import { SCOPES } from 'auth/scopes';
import { generateCode } from '../util/code';

export interface VerificaitonCodeParams {
  email?: string;
  code?: string;
  expiration?: Date;
}

const getVerificationCode = async (email: string): Promise<HydratedDocument<IVerificationCode>> => {
  const verificationCode = await VerificationCodeModel.findOne({ email });
  if (!verificationCode) throw new DocumentNotFoundError(email);
  return verificationCode;
};

const deleteVerificationCode = async (email: string): Promise<HydratedDocument<IVerificationCode>> => {
  const deletedVerificationCode = await VerificationCodeModel.findOneAndDelete({ email });
  if (!deletedVerificationCode) throw new DocumentNotFoundError(email);
  return deletedVerificationCode;
};

const createVerificationCode = async (fields: Pick<VerificaitonCodeParams, 'email'>): Promise<HydratedDocument<IVerificationCode>> => {
  if (await VerificationCodeModel.findOne({ email: fields.email })) {
    await deleteVerificationCode(fields.email as string);
  }
  try {
    return await VerificationCodeModel.create({
      ...fields,
      code: generateCode(6),
      expiration: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes from now
    });
  } catch (e: any) {
    throw e;
  }
};

const verifyVerificationCode = async (email: string, code: string): Promise<HydratedDocument<IUser>> => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) throw new BaseError('User not found', 404);
    else if (user.role !== SCOPES.UNVERIFIED.name) throw new BaseError('This user is already verified.', 401);

    const existingCode = await getVerificationCode(email);
    if (!existingCode || code !== existingCode.code) {
      throw new BaseError('Wrong verification code.', 401);
    }
    if (existingCode.expiration.getTime() < new Date().getTime()) {
      throw new BaseError('Verification code expired.', 401);
    }

    const verifiedUser = await UserModel.findOneAndUpdate({ id: user.id }, { role: SCOPES.USER.name }, { new: true });
    if (!verifiedUser) throw new DocumentNotFoundError(user.id);

    // delete verification code
    await deleteVerificationCode(existingCode.email);

    return verifiedUser;
  } catch (e: any) {
    if (e.code) { // is instanceOf BaseError
      throw e;
    }
    throw new BaseError(e.message, 500);
  }
};

const verificationCodeService = {
  createVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
  verifyVerificationCode,
};

export default verificationCodeService;