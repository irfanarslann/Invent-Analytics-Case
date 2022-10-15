const { Sequelize } = require('sequelize');
const config = require('config');
const db = {};

const sequelize = new Sequelize(
  config.get('dbName'),
  config.get('dbUser'),
  config.get('dbPass'),
  {
    host: 'localhost',
    dialect: 'mssql',
  }
);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = require('../models/users')(sequelize);
db.Books = require('../models/books')(sequelize);
db.Borrows = require('../models/borrows')(sequelize);

//One To Many Relation settings for sequelize
db.Users.hasMany(db.Books, { as: 'Active Borrows' });
db.Books.belongsTo(db.Users);
db.Users.hasMany(db.Borrows, { as: 'Borrow History' });
db.Borrows.belongsTo(db.Users);

module.exports = db;
