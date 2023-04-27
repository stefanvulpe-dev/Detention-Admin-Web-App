import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';
import { Prisoners, Visits } from './index.js';

export const PrisonerVisits = db.define('PrisonerVisits', {
  prisonerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Prisoners',
      key: 'id',
    },
  },
  visitId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Visits',
      key: 'id',
    },
  },
});
