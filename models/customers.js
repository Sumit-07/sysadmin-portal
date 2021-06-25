'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  customers.init({
    client_code: {type:DataTypes.INTEGER, defaultValue:0},
    full_name: DataTypes.STRING,
    address: DataTypes.STRING,
    address2: DataTypes.STRING,
    province: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    geo_lang: {type:DataTypes.FLOAT, defaultValue:0},
    geo_lat: {type:DataTypes.FLOAT, defaultValue:0},
    geo_valid: {type:DataTypes.FLOAT, defaultValue:0},
    country_code: {type:DataTypes.STRING, allowNull:false},
    phone_number: {type:DataTypes.STRING, allowNull:false},
    new_phone_number: DataTypes.STRING,
    comaker_name: DataTypes.STRING,
    comaker_address: DataTypes.STRING,
    active: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};