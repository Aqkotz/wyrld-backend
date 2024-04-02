import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { BaseError } from 'errors';

dotenv.config();

const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3 =
  ID && SECRET
    ? new S3({
      accessKeyId: ID,
      secretAccessKey: SECRET,
    })
    : null;

export const uploadImage = async ({
  key,
  buffer,
}: {
  key: string;
  buffer: Buffer;
}) => {
  if (!s3 || !BUCKET_NAME) throw new BaseError('Service not properly set up: .env or AWS settings', 503);
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
  };
  return s3
    .upload(params)
    .promise()
    .then((data) => {
      return data.Location;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const deleteImage = async ({
  key,
}: {
  key: string;
}) => {
  if (!s3 || !BUCKET_NAME) throw new BaseError('Service not properly set up: .env or AWS settings', 503);
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  return s3
    .deleteObject(params)
    .promise()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const resizeImage = async (buffer: Uint8Array) => {
  const largeBuffer = await sharp(buffer)
    .resize(2000)
    .jpeg({ quality: 50 })
    .toBuffer();

  const thumbBuffer = await sharp(buffer)
    .resize(250)
    .jpeg({ quality: 30 })
    .toBuffer();

  return {
    full: {
      key: Date.now().toString() + '_full.jpeg',
      buffer: largeBuffer,
    },
    thumb: {
      key: Date.now().toString() + '_thumb.jpeg',
      buffer: thumbBuffer,
    },
  };
};