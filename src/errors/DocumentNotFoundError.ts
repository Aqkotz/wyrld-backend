import BaseError from 'errors/BaseError';

class DocumentNotFoundError extends BaseError {
  id: string;

  info: string;

  constructor(id: string, info = '') {
    super(`Document with id '${id}' not found${info ? ` (${info})` : ''}`, 404);

    this.id = id;
    this.info = info;
  }
}

export default DocumentNotFoundError;
