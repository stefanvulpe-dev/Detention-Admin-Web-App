import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';
import { Visits } from './index.js';

export const Prisoners = db.define('Prisoners', {
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
  detentionStartedAt: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  detentionPeriod: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

Prisoners.belongsToMany(Visits, { through: 'PrisonerVisits' });
