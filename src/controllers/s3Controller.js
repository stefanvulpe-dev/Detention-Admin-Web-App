import { deleteFile, getFile } from '../services/s3Client.js';

/**
 *
 * @path '/photos/get-photo?photo=Da31VB34CCa'
 * @method GET
 */
export const getPhoto = async (req, res) => {
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
 * @path '/photos/delete-photo?photo=aSJ5732JMFCS'
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
