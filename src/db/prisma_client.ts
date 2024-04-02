/* eslint-disable @typescript-eslint/dot-notation */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { HASH_ROUNDS } from 'util/constants';

const prisma = new PrismaClient();

prisma.$use((params, next) => {
  if (params.model === 'User' && ['create', 'update'].includes(params.action) && params.args.data['password']) {
    params.args.data['password'] = bcrypt.hashSync(params.args.data['password'], HASH_ROUNDS);
  }
  return next(params);
});

export default prisma;