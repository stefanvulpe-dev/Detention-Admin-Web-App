import { User } from '../models/index.js';

export class UsersRepository {
  async create(user) {
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async find(id) {
    try {
      const user = await User.findOne({ where: { id: Number(id) } });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  //   async getVisitsHistory() {
  //     try {

  //     } catch(err) {
  //         throw new Error(err.message);
  //     }
  //   }
}