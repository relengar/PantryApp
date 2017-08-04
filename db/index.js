const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const db = {};
const sequelize = new Sequelize('dbpantry', 'pantryadm', 'pantry', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
