'use strict';
require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createPool({
  connectionLimit : 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_DATABASE
});
 
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
