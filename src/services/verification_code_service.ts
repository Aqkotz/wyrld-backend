import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { BaseError } from 'errors';
import { SCOPES } from 'auth/scopes';
import { generateCode } from '../util/code';
import prisma from 'db/prisma_client';
import { User, VerificationCode } from '@prisma/client';
import prismaExclude from 'util/prismaExclude';

export interface VerificaitonCodeParams {
  email?: string;
  code?: string;
  expiration?: Date;
}

const getVerificationCode = async (email: string): Promise<VerificationCode> => {
  const verificationCode = await prisma.verificationCode.findUnique({
    where: { email },
  });

  if (!verificationCode) throw new DocumentNotFoundError(email);
  return verificationCode;
};

const deleteVerificationCode = async (email: string): Promise<VerificationCode> => {
  const deletedVerificationCode = await prisma.verificationCode.delete({
    where: {
      email,
    },
  });
  if (!deletedVerificationCode) throw new DocumentNotFoundError(email);
  return deletedVerificationCode;
};

const createVerificationCode = async (fields: Pick<VerificaitonCodeParams, 'email'>): Promise<VerificationCode> => {
  if (await prisma.verificationCode.findUnique({
    where: { email: fields.email },
  })) {
    await deleteVerificationCode(fields.email as string);
  }
  try {

    return await prisma.verificationCode.create({
      data: {
        email: fields?.email ?? '',
        code: generateCode(6),
        expiration: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 minutes from now
      },
    });
  } catch (e: any) {
    throw e;
  }
};

const verifyVerificationCode = async (email: string, code: string): Promise<Omit<User, 'password'>> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: prismaExclude('User', ['password']),
    });

    if (!user) throw new BaseError('User not found', 404);
    else if (user.role !== SCOPES.UNVERIFIED.name) throw new BaseError('This user is already verified.', 401);

    const existingCode = await getVerificationCode(email);
    if (!existingCode || code !== existingCode.code) {
      throw new BaseError('Wrong verification code.', 401);
    }
    if (existingCode.expiration.getTime() < new Date().getTime()) {
      throw new BaseError('Verification code expired.', 401);
    }

    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: SCOPES.USER.name,
      },
      select: prismaExclude('User', ['password']),
    });
    
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