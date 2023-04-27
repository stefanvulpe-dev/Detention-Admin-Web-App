import { PrisonersRepository } from '../repositories/index.js';
/**
 * @Path '/prisoners?prisonerId=?'
 */
export const getPrisonerDetails = async (req, res) => {
  let prisonerId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  console.log(params);
  for (const [key, value] of params) {
    if (key === 'prisonerId') {
      prisonerId = value;
    }
  }
  const prisoner = await new PrisonersRepository().find(prisonerId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(prisoner));
};