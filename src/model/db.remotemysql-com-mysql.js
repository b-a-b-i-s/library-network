'use strict';

const mysql = require('mariadb/callback');

const connection = mysql.createPool(
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
