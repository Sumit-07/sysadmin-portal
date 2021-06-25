'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  sales.init({
    customer_id: DataTypes.INTEGER,
    acct_number: DataTypes.STRING,
    acct_type: DataTypes.STRING,
    acct_branch: DataTypes.STRING,
    vehicle_type: DataTypes.STRING,
    vehicle_brand: DataTypes.STRING,
    vehicle_desc: DataTypes.STRING,
    vehicle_color: DataTypes.STRING,
    vehicle_contract: DataTypes.STRING,
    interest_rate: DataTypes.DOUBLE,
    loan_amt: DataTypes.DOUBLE,
    net_amt: DataTypes.DOUBLE,
    loan_maturity: DataTypes.DATE,
    emi_due: DataTypes.DOUBLE,
    loan_term: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sales',
  });
  return sales;
};