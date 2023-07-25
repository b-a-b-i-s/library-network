'use strict';

const mariadb = require('mariadb/callback');

const connection = mariadb.createPool(
  process.env.MYSQL_URL ? `${process.env.MYSQL_URL}?connectionLimit=10` : 
  {
  connectionLimit : 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
}
);
 
connection.getConnection(function (err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

module.exports = connection
