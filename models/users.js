'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    acc_token: DataTypes.STRING,
    client_code: {type:DataTypes.INTEGER, defaultValue: 0},
    agent_id: {type:DataTypes.INTEGER, defaultValue: 0},
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    role: DataTypes.STRING,
    manager_id: DataTypes.INTEGER,
    city: DataTypes.STRING,
    branch: DataTypes.STRING,
    email: DataTypes.STRING,
    country_code: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    last_login_at: DataTypes.DATE, 
    last_logout_at: DataTypes.DATE 
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};