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
    validate: {
      haveExactDigits(number) {
        const stringValue = number.toString();
        if (stringValue.length != 13)
          throw Error('CNP-ul trebuie sa aiba 13 cifre.');
      },
    },
  },
  portrait_photo: {
    type: DataTypes.BLOB,
    allowNull: false,
    validate: {
      isSmallerThan5MB(value) {
        if (value.length > 5 * 1024 * 1024)
          throw Error('Fotografia nu trebuie sa fie mai mare decat 5MB!');
      },
    },
  },
});
