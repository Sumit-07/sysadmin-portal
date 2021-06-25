'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      queryInterface.addColumn(
        'sysadmins', // table name
        'last_login_at', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'sysadmins',
        'last_logout_at',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return Promise.all([
      queryInterface.removeColumn('sysadmins', 'last_login_at'),
      queryInterface.removeColumn('sysadmins', 'last_logout_at'),
    ]);
  }
};
