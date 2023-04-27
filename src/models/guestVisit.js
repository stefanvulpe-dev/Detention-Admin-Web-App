import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';
import { Guests, Visits } from './index.js';

export const GuestVisits = db.define('GuestVisits', {
  visitId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Visits',
      key: 'id',
    },
  },
  guestId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Guests',
      key: 'id',
    },
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Guests.belongsToMany(Visits, { through: GuestVisits });
Visits.belongsToMany(Guests, { through: GuestVisits });
