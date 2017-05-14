const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const scriptGetSid = (sid) => `select * from Script where sid = ${sid}`;

const scriptGetName = (name) => `select * from Script where name = "${name}"`;

const scriptAll = () => `SELECT s.sid, sr.status, s.name, s.path, s.state FROM Script s LEFT JOIN Run r ON s.sid = r.sid LEFT JOIN (SELECT * FROM ScriptRunSummary ORDER BY hid DESC) sr ON r.sid = sr.sid WHERE s.current != 0 GROUP BY s.sid`;

const scriptCreate = (name, path, state) => `insert into Script (name, path, state, current) values ("${name}", "${path}", "${state}", 1)`;

const scriptUpdate = (sid, name, path, state, current) => `update Script set name = "${name}", path = "${path}", state = "${state}", current = ${current} where sid = ${sid}`;

const scriptDelete = (sid) => `update Script set current = 0 where sid = ${sid}`;
//const scriptDelete = (sid) => `delete from Script where sid = ${sid}`;

exports.getScripts = (cb) => Conn.getConn().query(scriptAll(), (err, data) => cb(DaoHelper.formatNulls(data)));

exports.createScript = (name, path, state, cb) => {
  Conn.getConn().query(scriptCreate(name, path, state), (err, data) => {
    if (err) cb({'success': 0, 'message': 'Something went wrong when retrieving the script'});
    else cb({'success': 1, 'message': 'Created script ' + name + ' ' + path + ' ' + state});
  });
}

exports.updateScript = (sid, name, path, state, current, cb) => {
  Conn.getConn().query(scriptGetSid(sid), (err, data) => {
    if (err) cb({'success': 0, 'message': 'Something went wrong when retrieving the script'});
    else if (data.length == 0) cb({'success': 0, 'message': 'Script ' + sid + ' does not exist'});
    else Conn.getConn().query(scriptUpdate(sid, name, path, state, current), (err, data) => {
      if (err) cb({'success': 0, 'message': 'Something went wrong when updating the script'});
      else cb({'success': 1, 'message': 'Updated Script ' + sid + ' ' + name + ' ' + path + ' ' + state + ' ' + current});
    });
  });
}

exports.deleteScript = (sid, cb) => {
  Conn.getConn().query(scriptGetSid(sid), (err, data) => {
    if (err) cb({'success': 0, 'message': 'Something went wrong when retrieving the script'});
    else if (data.length == 0) cb({'success': 0, 'message': 'Script ' + sid + ' does not exist'});
    else Conn.getConn().query(scriptDelete(sid), (err, data) => {
      if (err) cb({'success': 0, 'message': 'Something went wrong when deleting the script'});
      else cb({'success': 1, 'message': 'Deleted Script ' + sid});
    });
  });
}
