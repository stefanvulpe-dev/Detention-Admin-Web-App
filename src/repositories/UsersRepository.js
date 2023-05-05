import { Users } from '../models/index.js';

export class UsersRepository {
  async create(user) {
    try {
      const newUser = await Users.create(user);
      return newUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async find(id) {
    try {
      const user = await Users.findOne({ where: { id: Number(id) } });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async login(email, password) {
    try {
      const user = await Users.login(email, password);
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
