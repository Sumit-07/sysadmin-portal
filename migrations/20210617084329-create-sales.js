'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      acct_number: {
        type: Sequelize.STRING
      },
      acct_type: {
        type: Sequelize.STRING
      },
      acct_branch: {
        type: Sequelize.STRING
      },
      vehicle_type: {
        type: Sequelize.STRING
      },
      vehicle_brand: {
        type: Sequelize.STRING
      },
      vehicle_desc: {
        type: Sequelize.STRING
      },
      vehicle_color: {
        type: Sequelize.STRING
      },
      vehicle_contract: {
        type: Sequelize.STRING
      },
      interest_rate: {
        type: Sequelize.DOUBLE
      },
      loan_amt: {
        type: Sequelize.DOUBLE
      },
      net_amt: {
        type: Sequelize.DOUBLE
      },
      loan_maturity: {
        type: Sequelize.DATE
      },
      emi_due: {
        type: Sequelize.DOUBLE
      },
      loan_term: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('sales');
  }
};