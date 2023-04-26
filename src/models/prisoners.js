import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';

export const Prisoners = db.define('Prisoners', {
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
  started_at: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  detention_period: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});
