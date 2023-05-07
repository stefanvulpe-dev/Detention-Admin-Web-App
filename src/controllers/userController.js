import { UsersRepository } from '../repositories/index.js';
import * as Utils from './utils.js';
import joi from 'joi';

/**
 * @Path '/users?userId=?'
 */
export const getUserDetails = async (req, res) => {
  let userId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'userId') {
      userId = value;
    }
  }
  try {
    const user = await new UsersRepository().find(userId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
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

/**
 * @Path '/register/
 */

export const register = async (req, res) => {
  try {
    const schema = joi.object({
      firstName: joi.string().required().pattern(new RegExp('[a-zA-Z]{3,20}')),
      lastName: joi.string().required().pattern(new RegExp('[a-zA-Z]{3,20}')),
      email: joi.string().email().required(),
      password: joi
        .string()
        .required()
        .pattern(new RegExp('[a-zA-Z0-9!@#$]{6,30}')),
    });

    const body = await Utils.getReqData(req);
    const data = JSON.parse(body);
    const { error } = schema.validate(data);
    if (error) throw new Error(error);

    await new UsersRepository().create({ photo: '', ...data });

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify('Data is valid.'));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
};
