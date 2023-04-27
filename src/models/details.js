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
    validate: {
      checkDate(date) {
        const current_date = new Date(),
          visitDate = new Date(visitDate);
        if (current_date - visitDate > 0)
          throw new Error('Programarea nu poate fi facuta in trecut!');
      },
    },
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      checkTime(time) {
        // DataTypes.TIME format -> HH:MM:SS
        const timeAttributes = time.split(':');
        if (
          +timeAttributes[0] > 2 ||
          (+timeAttributes[0] === 2 &&
            (+timeAttributes[1] !== 0 || +timeAttributes[2] !== 0))
        )
          throw new Error('Programarea poate dura maxim 2 ore!');
      },
    },
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
