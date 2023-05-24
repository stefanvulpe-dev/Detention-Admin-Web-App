import Joi from 'joi';
import multer from 'multer';
import { deleteFile, getFile, uploadFile } from '../libs/s3Client.js';
import { GuestsRepository } from '../repositories/index.js';
import * as Utils from './utils.js';
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
 * Used for form validation on submit from addGuest dialog
 * @path '/guests/add-guest'
 * @method POST
 */
export const postAddGuest = async (req, res) => {
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
        const { relationship, ...guestData } = req.body;

        let guest, payload;
        guest = await new GuestsRepository().findByNationalId(
          req.body.nationalId
        );
        if (!guest) {
          payload = await new GuestsRepository().create(guestData);
        } else {
          await deleteFile(guest.photo);
          payload = await new GuestsRepository().updatePhoto(
            guest.nationalId,
            imageName
          );
        }
        const { createdAt, updatedAt, ...tmpGuest } = payload;
        guest = { relationship, ...tmpGuest };
        res.end(JSON.stringify({ error: false, guest }));
      } catch (err) {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ error: true, message: err.message }));
      }
    }
  });
};

/**
 *
 * @path '/guests/get-photo?guestId=1'
 * @method GET
 */
export const getGuestPhoto = async (req, res) => {
  let guestId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'guestId') {
      guestId = value;
    }
  }

  if (!guestId) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({ error: true, message: 'Missing guest id.' })
    );
  }

  try {
    const guest = await new GuestsRepository().findById(guestId);
    const url = await getFile(guest.photo);
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, url }));
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/guests/delete-guest'
 * @method DELETE
 */
export const deleteGuest = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const guest = JSON.parse(body);
    await deleteFile(guest.photo);
    await new GuestsRepository().deleteById(guest.id);
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(
      JSON.stringify({ error: false, message: 'Guest deleted successfully.' })
    );
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
