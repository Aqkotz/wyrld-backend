/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose'); // * This syntax defines `process.env.MONGO_URL`

export const mockUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Joe Smith',
  role: 'USER',
};

export async function connectDB() {
  const mongooseOpts = {
    loggerLevel: 'error',
  };

  mongoose.connect(process.env.MONGO_URL, mongooseOpts);

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      mongoose.connect(process.env.MONGO_URL, mongooseOpts);
    } else {
      throw e;
    }
  });

  mongoose.connection.once('open', () => { return; });
}

export async function dropDB() {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
}
