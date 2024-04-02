/* eslint-disable func-names */
import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { SCOPES, ScopeNames } from 'auth/scopes';
import { CompareCallback } from 'util/constants';

export interface IUser {
  id: string;
  email: string;
  password: string; // encrypted
  name: string;
  role: ScopeNames;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, default: SCOPES.USER.name, enum: [SCOPES.UNVERIFIED.name, SCOPES.USER.name, SCOPES.ADMIN.name] },
  ...({} as {
    comparePassword: (password: string, callback: CompareCallback) => void
  }),
}, {
  timestamps: true,
});

UserSchema.set('toObject', {
  virtuals: true,
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, {
    __v, password, ...user
  }) => user,
});

const saltRounds = 10;

UserSchema.pre('save', function (next) {
  // Check if password needs to be rehashed
  if (this.isNew || this.isModified('password')) {
    // Hash and save document password
    bcrypt.hash(this.password, saltRounds, (error, hashedPassword) => {
      if (error) {
        next(error);
      } else {
        this.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function (password: string, callback: CompareCallback): void {
  bcrypt.compare(password, this.password, (error, same) => {
    if (error) {
      callback(error);
    } else {
      callback(null, same);
    }
  });
};

const UserModel = mongoose.model<IUser>('User', UserSchema);

// export { UserSchema };

export default UserModel;
