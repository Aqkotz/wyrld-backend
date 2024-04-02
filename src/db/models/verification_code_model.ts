import mongoose, { Schema } from 'mongoose';

export interface IVerificationCode {
  email: string;
  code: string;
  expiration: Date;
}

export const VerificationCodeSchema = new Schema<IVerificationCode>({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiration: { type: Date, required: true },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, { __v, ...verificationCode }) => verificationCode,
  },
});

const VerificationCodeModel = mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);

export default VerificationCodeModel;