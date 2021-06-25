'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recommends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  recommends.init({
    client_code: {type:DataTypes.INTEGER, allowNull:false},
    acct_number: {type:DataTypes.STRING, allowNull:false},
    year: {type:DataTypes.STRING, allowNull:false},
    month: {type:DataTypes.STRING, allowNull:false},
    visit_date:{type:DataTypes.DATEONLY, allowNull:false},
    recommendation_text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'recommends',
  });
  return recommends;
};