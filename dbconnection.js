const mysql = require('mysql');
const config = require('./config.json');

var con = mysql.createConnection({
  host: config['database']['host'],
  user: config['database']['user'],
  password: config['database']['password'],
  database: config['database']['db']
});

module.exports = {query: function(sql){
  return new Promise(function(resolve, reject){
    con.query(sql, function (err, rows) {
      if (err) {return reject(err);};
      resolve(rows);
    });
  });
}};
