'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_code: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      full_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      geo_lang: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      geo_lat: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      geo_valid: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      new_phone_number: {
        type: Sequelize.STRING
      },
      comaker_name: {
        type: Sequelize.STRING
      },
      comaker_address: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('customers');
  }
};