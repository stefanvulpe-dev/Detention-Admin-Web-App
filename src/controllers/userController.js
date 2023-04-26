import { UsersRepository } from '../repositories/index.js';
import * as Utils from './utils.js';

/**
 * @Path '/users?userId=?'
 */
export const getUserDetails = async (req, res) => {
  let userId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  console.log(params);
  for (const [key, value] of params) {
    if (key === 'userId') {
      userId = value;
    }
  }
  const user = await new UsersRepository().find(userId);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

/**
 * @Path '/users/add-user'
 */
export const postAddUser = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const newUser = JSON.parse(body);
    const result = await new UsersRepository().create(newUser);
    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};
