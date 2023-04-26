import { DataTypes } from 'sequelize';
import { db } from './db/connection.js';
import { Details } from './details.js';
import { Prisoners } from './prisoners.js';

export const Visits = db.define('Visits', {
  idGuests: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
    validate: {
      checkMaxNumber(value) {
        if (value && value.length > 5)
          throw Error('Numarul maxim de vizitatori este 5!');
      },
    },
  },
  idVisit: {
    type: DataTypes.INTEGER,
    references: {
      model: Details,
      key: id,
    },
  },
  idPrisoner: {
    type: DataTypes.INTEGER,
    references: {
      model: Prisoners,
      key: id,
    },
  },
});

Details.hasOne(Visits, { foreignKey: idVisit });
Prisoners.hasOne(Visits, { foreignKey: idPrisoner });
