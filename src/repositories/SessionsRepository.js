import { Sessions } from '../models/index.js';

export class SessionsRepository {
  async verifySession(userId, csrfToken) {
    try {
      const result = await Sessions.findOne({
        where: { csrfToken: csrfToken, UserId: +userId },
      });
      if (!result) {
        throw new Error(
          `A session for the user ${userId} and csrfToken ${csrfToken} has not been found`
        );
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async deleteSession(userId, csrfToken) {
    try {
      const affectedRows = await Sessions.destroy({
        where: { csrfToken: csrfToken, UserId: +userId },
      });
      if (affectedRows === 0) {
        throw new Error(
          `A session for the user ${userId} and csrfToken ${csrfToken} has not been found`
        );
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
