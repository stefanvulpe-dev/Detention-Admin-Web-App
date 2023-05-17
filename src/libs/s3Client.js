import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import sharp from 'sharp';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

// Create an Amazon S3 service client object.
const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region,
});

export async function uploadFile(file) {
  const buffer = await sharp(file.buffer)
    .resize({ height: 600, width: 600, fit: 'cover' })
    .toBuffer();

  const imageName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: buffer,
    ContentType: file.mimetype,
  };
  try {
    await s3.send(new PutObjectCommand(params));
    return imageName;
  } catch (err) {
    console.log(err);
  }
}

export async function getFile(imageName) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: imageName,
  };
  const command = new GetObjectCommand(getObjectParams);
  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    console.log(err);
  }
}
