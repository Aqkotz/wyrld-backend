import { Request } from 'express';
import { ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';
import { User } from '@prisma/client';

export interface RequestWithJWT extends Request {
  user: User,
}

export interface ValidatedRequestWithJWT<T extends ValidatedRequestSchema> extends ValidatedRequest<T> {
  user: User,
}
