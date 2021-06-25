'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sys_admin_activity_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  sys_admin_activity_logs.init({
    action: DataTypes.STRING,
    action_type: DataTypes.STRING,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sys_admin_activity_logs',
  });
  return sys_admin_activity_logs;
};