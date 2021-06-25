const Sequelize = require('sequelize')
require("dotenv").config();
const db = {}
const sequelize = new Sequelize(process.env.DB_NAME, 
                                process.env.USER, 
                                process.env.PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log,
  freezeTableName: true,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db