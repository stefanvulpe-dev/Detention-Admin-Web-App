import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';
import { Users } from './user.js';

export const Sessions = db.define(
  'Sessions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    csrfToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Users.hasMany(Sessions);
Sessions.belongsTo(Users);
