require('dotenv').config({ path: require('find-config')('.env') })
var mysql = require('mysql');
//module.exports.tempint = async function exec() {
    module.exports.database_insert = async function exec(temp_int, hum_int, temp_ext, hum_ext, moisture, light, water_level) {

            
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
            //console.log(result);
            });
            con.query("USE serradb;", function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
            });

            var query_table = "CREATE TABLE IF NOT EXISTS parameters_table(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, temp_int FLOAT NULL , hum_int FLOAT NULL , temp_ext FLOAT NULL , hum_ext FLOAT NULL , moisture FLOAT NULL , light FLOAT NULL , water_level FLOAT NULL, date DATETIME );"
            await con.query(query_table);

            //REQUEST
            //var query = "select * from tasks";
            //var rows = await conn.query(query);

            //INSERT
            var query_insert = "INSERT INTO parameters_table (temp_int, hum_int, temp_ext, hum_ext, moisture, light, water_level, date) VALUES (?,?,?,?,?,?,?,?)";
            await con.query(query_insert, [temp_int, hum_int, temp_ext, hum_ext, moisture, light, water_level, new Date()]);

            con.end();
        }


    module.exports.database_read = function(callback){

            var con = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            insecureAuth : true
            });
            con.connect(function(err) {
            if (err) throw err;
            console.log("Database Read");
            });

            con.query("USE serradb;", function (err, result, fields) {

                
                if (err) throw err;
                //console.log(result);
                });

            con.query("SELECT * FROM parameters_table; ", function (err, result, fields) {
            
            if (err) throw err;
            var resultArray = Object.values(JSON.parse(JSON.stringify(result)))
            //console.log(resultArray);
            return callback(result);
            
            
            //console.log(result);
            //var lowTotal = [];
            //for(item of result){
            //lowTotal.push(item.name);
            //}
            //console.log(lowTotal)
          
          });
          con.end();
        }
