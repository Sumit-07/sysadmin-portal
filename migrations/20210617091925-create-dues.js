'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sales_id: {
        type: Sequelize.INTEGER
      },
      install_num: {
        type: Sequelize.INTEGER
      },
      month_due_date: {
        type: Sequelize.DATEONLY
      },
      expected_amt: {
        type: Sequelize.DECIMAL
      },
      penalty_due: {
        type: Sequelize.DECIMAL
      },
      rebate: {
        type: Sequelize.DECIMAL
      },
      createdBy: {
        type: Sequelize.STRING
      },
      updatedBy: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dues');
  }
};