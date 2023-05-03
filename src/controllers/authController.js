import { getReqData } from './utils.js';

/**
 *
 * @Path /register
 */
export const register = async (req, res) => {
  const { firstName, lastName, email, password, photo } = JSON.parse(
    getReqData(req.body)
  );
  console.log(username, password);
};
