const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

// Създаване на Sequelize инстанция
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

// Зареждане на модели
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Company = require('./company.model')(sequelize, Sequelize);

module.exports = db;
