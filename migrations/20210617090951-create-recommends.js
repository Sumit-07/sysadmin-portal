'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recommends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_code: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      acct_number: {
        type: Sequelize.STRING,
        allowNull:false
      },
      year: {
        type: Sequelize.STRING,
        allowNull:false
      },
      month: {
        type: Sequelize.STRING,
        allowNull:false
      },
      visit_date: {
        type: Sequelize.DATEONLY,
        allowNull:false
      },
      recommendation_text: {
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
    await queryInterface.dropTable('recommends');
  }
};