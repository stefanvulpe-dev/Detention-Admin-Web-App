import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';

export const Details = db.define('Details', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  nature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  objects: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
