import Joi from 'joi';
import multer from 'multer';
import { UsersRepository } from '../repositories/index.js';
import { deleteFile, uploadFile } from '../services/s3Client.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @path '/users/get-profile'
 * @method GET
 */
export const getUserDetails = async (req, res) => {
  try {
    const { password, createdAt, updatedAt, ...user } =
      await new UsersRepository().findById(req.userId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, user }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};

/**
 * @path '/users/update-profile'
 * @method PUT
 * @body { name, email, password, photo }
 */
export const updateUserDetails = async (req, res) => {
  upload.single('photo')(req, res, async err => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during the upload
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: true, message: err.message }));
    } else if (err) {
      // An unknown error occurred during the upload
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ error: true, message: 'Error uploading file.' })
      );
    } else {
      // File upload successful
      const { error } = Joi.object({
        firstName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
        lastName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
        email: Joi.string().email().required(),
        password: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
          .required(),
      }).validate(req.body);

      if (error) {
        res.writeHead(400, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ error: true, message: error.message }));
      }

      try {
        const tmpUser = await new UsersRepository().findById(req.userId);

        if (!tmpUser) {
          throw new Error('User not found.');
        }

        await deleteFile(tmpUser.photo);

        const uploadedFile = req.file;
        const imageName = await uploadFile(uploadedFile);

        req.body.photo = imageName;

        await new UsersRepository().updateById(tmpUser.id, req.body);

        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(
          JSON.stringify({
            error: false,
            message: 'Profile updated successfully',
          })
        );
      } catch (err) {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: true, message: err.message }));
      }
    }
  });
};
