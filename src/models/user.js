import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';

export const Users = db.define(
  'Users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [6], msg: 'Minimum password length in 6 characters' },
      },
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Users.beforeCreate(async user => {
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
});

Users.login = async function (email, password) {
  const user = await this.findOne({ where: { email: email } });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error('Incorrect password');
  }
  throw new Error('Incorrect email');
};
