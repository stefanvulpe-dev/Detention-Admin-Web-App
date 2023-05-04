'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Users', 'role', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'user',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Users', 'role');
}
