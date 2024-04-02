class BaseError extends Error {
  code: number;

  name: string;

  message: string;

  constructor(message: string, code: number) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.code = code;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export default BaseError;
