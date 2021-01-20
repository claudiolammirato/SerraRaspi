require('dotenv').config()

var mysql = require('mysql');
    var con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      insecureAuth : true
    });
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });

    con.query("CREATE DATABASE IF NOT EXISTS serradb;", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
    con.query("USE serradb;", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });


    con.query("CREATE TABLE IF NOT EXISTS parameters_table (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY, `name` VARCHAR(50) NULL DEFAULT '', `value` VARCHAR(100) NULL DEFAULT '');", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
    con.end();


