const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://username:P@ssword1@localhost:5432/myapp",
  {
    host: "localhost",
    dialect: "postgres",
  },
);
module.exports = sequelize;