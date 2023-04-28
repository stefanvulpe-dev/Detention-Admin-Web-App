import { db } from './db/connection.js';
import { DataTypes } from 'sequelize';

import { Visits, Guests } from './index.js';

export const GuestVisits = db.define('GuestVisits', {
  prisonerRelation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Visits.belongsToMany(Guests, { through: GuestVisits });
Guests.belongsToMany(Visits, { through: GuestVisits });
