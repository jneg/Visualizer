const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const journalAll = () => `select jid, moment, source, message from Journal order by jid desc`;

exports.getJournal = (cb) => Conn.getConn().query(journalAll(), (err, data) => cb(DaoHelper.formatNulls(DaoHelper.formatDates(data, 'moment'))));
