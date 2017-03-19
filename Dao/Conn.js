const mysql = require('mysql');

const conn = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'OverlordDB'});
conn.connect();

setInterval(() => conn.query('SELECT 1'), 10 * 60 * 1000);

exports.getConn = () => {
  return conn;
}
