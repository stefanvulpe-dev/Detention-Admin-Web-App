import { UsersRepository } from '../repositories/index.js';

/**
 * @Path '/users/get-profile
 */
export const getUserDetails = async (req, res) => {
  try {
    const { password, photo, ...userDetails } =
      await new UsersRepository().findById(req.userId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userDetails));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};
