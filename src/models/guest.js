import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';

export const Guests = db.define('Guests', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: 'Please enter a valid email',
      },
    },
  },
  cnp: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  photo: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
});
