const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const scriptGetSid = (sid) => `select * from Script where sid = ${sid}`;

const scriptGetName = (name) => `select * from Script where name = "${name}"`;

const scriptHistoryAll = (sid) => `select srs.hid, srs.start_time, srs.end_time, srs.status, ts.inserted, ts.modified, ts.deleted, srs.notes from ScriptRunSummary srs left join TableStatus ts on srs.hid = ts.hid join Script s on srs.sid = s.sid where srs.sid = ${sid} order by srs.hid desc limit 50`

exports.getScriptHistory = (sid, cb) => {
   Conn.getConn().query(scriptHistoryAll(sid), (err, data) => cb(DaoHelper.formatNulls(DaoHelper.formatDates(DaoHelper.formatDates(data,'end_time'), 'start_time'))));
};
