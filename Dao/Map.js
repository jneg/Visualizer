const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const mapStatus = () => `select s.state, MIN(srs.status) status from Script s join ScriptRunSummary srs on srs.sid = s.sid left join ScriptRunSummary srs2 on srs.sid = srs2.sid and srs.hid < srs2.hid join Run r on r.sid = s.sid where srs2.hid is null and s.current = true group by s.state`;

exports.getMap = (cb) => Conn.getConn().query(mapStatus(), (err, data) => cb(DaoHelper.formatNulls(data)));
