'use strict';

const mysql = require('mysql');

const connection = mysql.createPool(
  process.env.MYSQLDB_URL ? `${process.env.MYSQLDB_URL}?connectionLimit=10` : `mysql://${process.env.MYSQLDB_USERNAME}:${process.env.MYSQLDB_PASSWORD}@${process.env.MYSQLDB_HOST}/${process.env.MYSQLDB_DATABASE}?connectionLimit=10`
//   {
//   connectionLimit : 10,
//   host: process.env.MYSQLDB_HOST,
//   user: process.env.MYSQLDB_USERNAME,
//   password: process.env.MYSQLDB_PASSWORD,
//   database : process.env.MYSQLDB_DATABASE,
//   port: process.env.MYSQLDB_PORT
// }
);
 
connection.getConnection(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

// const connection = mysql.createConnection({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database : process.env.DATABASE_DATABASE
// });

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to the database!");
//   // connection.query(`SELECT * FROM Βιβλιοθήκη`, function (err, result) {
//   //   if (err) throw err;
//   //   console.log("Result: " + result);
//   //   for (let index = 0; index < result.length; index++) {
//   //       console.log(result[index])
        
//   //   }
//   // });
// });



module.exports = connection
