'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dues extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  dues.init({
    sales_id: {type:DataTypes.INTEGER, allowNull:false},
    install_num: DataTypes.INTEGER,
    month_due_date: DataTypes.DATEONLY,
    expected_amt: DataTypes.DECIMAL,
    penalty_due: DataTypes.DECIMAL,
    rebate: DataTypes.DECIMAL,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dues',
  });
  return dues;
};