const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const scriptGetSid = (sid) => `select * from Script where sid = ${sid}`;

const scriptGetName = (name) => `select * from Script where name = "${name}"`;

const scriptHistoryAll = (sid) => `select s.hid, s.sid, s.status, s.notes from ScriptRunSummary s where s.sid = ${sid} order by end_time desc limit 10`;

exports.getScriptHistory = (sid, cb) => {
   Conn.getConn().query(scriptHistoryAll(sid), (err, data) => cb(DaoHelper.formatNulls(data)));
};
