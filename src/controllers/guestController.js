import Joi from 'joi';
import multer from 'multer';
import { deleteFile, getFile, uploadFile } from '../libs/s3Client.js';
import { GuestsRepository } from '../repositories/index.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @Path '/guests?guestId=?'
 */
export const getGuestDetails = async (req, res) => {
  let guestId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'guestId') {
      guestId = value;
    }
  }
  try {
    const guest = await new GuestsRepository().find(guestId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(guest));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};

/**
 * Used for form validation on submit from addGuests and editGuests dialogs
 * @path '/guests/add-guest'
 * @method POST
 */
export const validateGuest = async (req, res) => {
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
        firstName: Joi.string().pattern(new RegExp(`^[a-z ,.'-]+$`, 'i')),
        lastName: Joi.string().pattern(new RegExp(`^[a-z ,.'-]+$`, 'i')),
        nationalId: Joi.string().pattern(new RegExp('[0-9]{13}')),
        passportNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        relationship: Joi.string().pattern(new RegExp('[A-Za-zs]+')),
      }).validate(req.body);

      if (error) {
        res.writeHead(400, { 'Content-type': 'application/json' });
        return res.end(JSON.stringify({ error: true, message: error.message }));
      }

      try {
        const uploadedFile = req.file;
        const imageName = await uploadFile(uploadedFile);

        req.body.photo = imageName;
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: false, guest: req.body }));
      } catch (err) {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: true, message: err.message }));
      }
    }
  });
};

/**
 *
 * @path '/guests/get-photo?photo=Da31VB34CCa'
 * @method GET
 */
export const getGuestPhoto = async (req, res) => {
  let photo;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'photo') {
      photo = value;
    }
  }

  if (!photo) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({ error: true, message: 'Missing photo parameter.' })
    );
  }

  try {
    const url = await getFile(photo);
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, url }));
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/guests/delete-photo?photo=aSJ5732JMFCS'
 * @method DELETE
 */
export const deletePhoto = async (req, res) => {
  let photo;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'photo') {
      photo = value;
    }
  }

  if (!photo) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({ error: true, message: 'Missing photo parameter.' })
    );
  }

  try {
    await deleteFile(photo);
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(
      JSON.stringify({ error: false, message: 'Photo deleted successfully.' })
    );
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
