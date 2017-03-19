const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const scheduleGetSchedId = (schedId) => `select * from Schedule where sched_id = ${schedId}`;

const scheduleGetName = (name) => `select * from Schedule where name = "${name}"`;

const scheduleAll = () => `select sch.sched_id, sch.name, sch.day, sch.time, count(r.sid) numScripts from Schedule sch left join Run r on sch.sched_id = r.sched_id group by sch.sched_id`;

const scheduleCreate = (name, day, time) => `insert into Schedule (name, day, time) values ("${name}", "${day}", "${time}")`;

const scheduleUpdate = (schedId, name, day, time) => `update Schedule set name = "${name}", day = "${day}", time = "${time}" where sched_id = ${schedId}`;

const scheduleAddScripts = (schedId, sids) => {
  var q = `insert into Run (sched_id, script_order, sid, db) values `
  for (var order = 1; order <= sids.length; order++) q += `(${schedId}, ${order}, ${sids[order - 1]}, "DDDB2016Aug"),`;
  return q.slice(0, -1)
}

const scheduleDeleteScripts = (schedId) => `delete from OverlordDB.Run where sched_id = ${schedId}`;

const scheduleDelete = (schedId) => `delete from OverlordDB.Schedule where sched_id = ${schedId}`;

exports.getSchedules = (cb) => Conn.getConn().query(scheduleAll(), (err, data) => cb(DaoHelper.formatNulls(data)));

exports.createSchedule = (name, day, time, cb) => {
  Conn.getConn().query(scheduleGetName(name), (err, data) => {
    if (err) cb({'success': 0, 'message': 'Something went wrong when retrieving the schedule'});
    else if (data.length == 1) cb({'success': 0, 'message': 'Schedule ' + name + ' already exists'});
    else Conn.getConn().query(scheduleCreate(name, day, time), (err, data) => {
      if (err) cb({'success': 0, 'message': 'Something went wrong when creating the schedule'});
      else cb({'success': 1, 'message': 'Created schedule ' + name + ' ' + day + ' ' + time});
    });
  });
}

exports.updateSchedule = (schedId, name, day, time, sids, cb) => {
  Conn.getConn().query(scheduleGetSchedId(schedId), (err, data) => {
    if (err) cb({'success': 0, 'message': 'Something went wrong when retrieving the schedule'});
    else if (data.length == 0) cb({'success': 0, 'message': 'Schedule ' + schedId + ' does not exist'});
    else Conn.getConn().query(scheduleUpdate(schedId, name, day, time), (err, data) => {
      if (err) cb({'success': 0, 'message': 'Something went wrong when updating the schedule'});
      else Conn.getConn().query(scheduleDeleteScripts(schedId), (err, data) => {
        if (err) cb({'success': 0, 'message': 'Something went wrong when deleting the schedule scripts'});
        else Conn.getConn().query(scheduleAddScripts(schedId, sids), (err, data) => {
          if (err) cb({'success': 0, 'message': 'Something went wrong when adding the schedule scripts'});
          else cb({'success': 1, 'message': 'Updated schedule ' + sids + ' ' + name + ' ' + day + ' ' + time + ' ' + sids});
        });
      });
    });
  });
}

exports.deleteSchedule = (schedId, cb) => {
  Conn.getConn().query(scheduleGetSchedId(schedId), (err, data) => {
    if (err) cb({'success': 0, 'message': 'Something went wrong when retrieving the schedule'});
    else if (data.length == 0) cb({'success': 0, 'message': 'Schedule ' + schedId + ' does not exist'});
    else Conn.getConn().query(scheduleDeleteScripts(schedId), (err, data) => {
      if (err) cb({'success': 0, 'message': 'Something went wrong when deleting the schedule scripts'});
      else Conn.getConn().query(scheduleDelete(schedId), (err, data) => {
        if (err) cb({'success': 0, 'message': 'Something went wrong when deleting the schedule'});
        else cb({'success': 1, 'message': 'Deleted schedule ' + schedId});
      });
    });
  });
}
