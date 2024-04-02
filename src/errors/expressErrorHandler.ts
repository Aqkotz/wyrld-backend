/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import BaseError from './BaseError';
import DocumentNotFoundError from './DocumentNotFoundError';
import ServerError from './ServerError';

const createError = (err: any): BaseError => {
  switch (true) {
    case err instanceof BaseError:
      return err;
    case err.kind === 'ObjectId':
      return new DocumentNotFoundError(err.value);
    default:
      return new ServerError(err.message ?? '');
  }
};

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const error = createError(err);
  const message = error.code < 500
    ? 'Request error'
    : 'Server error';

  res.status(error.code).json({ message, errors: [error.message] });
};

export default errorHandler;
