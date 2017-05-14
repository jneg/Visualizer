const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const scriptGetSid = (sid) => `select * from Script where sid = ${sid}`;

const scriptAll = () => `SELECT s.sid, sr.status, s.name, s.path, s.state FROM Script s LEFT JOIN Run r ON s.sid = r.sid LEFT JOIN (SELECT * FROM ScriptRunSummary ORDER BY hid DESC) sr ON r.sid = sr.sid WHERE s.current != 0 GROUP BY s.sid`;

const scriptCreate = (name, path, state) => `insert into Script (name, path, state, current) values ("${name}", "${path}", "${state}", 1)`;

const scriptUpdate = (sid, name, path, state, current) => `update Script set name = "${name}", path = "${path}", state = "${state}", current = ${current} where sid = ${sid}`;

const scriptDelete = (sid) => `update Script set current = 0 where sid = ${sid}`;

exports.getScripts = (cb) => Conn.getConn().query(scriptAll(), (err, data) => cb(DaoHelper.formatNulls(data)));

exports.createScript = (name, path, state) => Conn.getConn().query(scriptCreate(name, path, state), (err, data) => {});

exports.updateScript = (sid, name, path, state, current) => {
  Conn.getConn().query(scriptGetSid(sid), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scriptUpdate(sid, name, path, state, current), (err, data) => {});
  });
}

exports.deleteScript = (sid, cb) => {
  Conn.getConn().query(scriptGetSid(sid), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scriptDelete(sid), (err, data) => {});
  });
}
