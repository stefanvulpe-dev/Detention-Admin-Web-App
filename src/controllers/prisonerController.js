import { PrisonersRepository } from '../repositories/index.js';
/**
 * @Path '/prisoners?prisonerId=?'
 */
export const getPrisonerDetails = async (req, res) => {
  let prisonerId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'prisonerId') {
      prisonerId = value;
    }
  }
  try {
    const prisoner = await new PrisonersRepository().find(prisonerId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(prisoner));
    } catch(err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      }
};