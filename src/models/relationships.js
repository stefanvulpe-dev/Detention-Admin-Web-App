import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';
import { Guests } from './guests.js';
import { Prisoners } from './prisoners.js';

export const Relationships = db.define('Relationships', {
  idGuest: {
    type: DataTypes.INTEGER,
    references: {
      model: Guests,
      key: 'id',
    },
  },
  idPrisoner: {
    type: DataTypes.INTEGER,
    references: {
      model: Prisoners,
      key: 'id',
    },
  },
  prisoner_relation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Relationships.belongsTo(Guests, { foreignKey: 'idGuest' });
Guests.hasOne(Relationships, { foreignKey: 'idGuest' });

Relationships.belongsTo(Prisoners, { foreignKey: 'idPrisoner' });
Prisoners.hasOne(Relationships, { foreignKey: 'idPrisoner' });
