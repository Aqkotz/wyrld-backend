import BaseError from './BaseError';

class ServerError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}

export default ServerError;
