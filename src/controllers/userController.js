import { UsersRepository } from '../repositories/index.js';

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
