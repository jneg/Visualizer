const Conn = require('./Conn');
const DaoHelper = require('./DaoHelper');

const scheduleGetId = (schId) => `select * from Schedule where sched_id = ${schId}`;

const scheduleGetName = (name) => `select * from Schedule where name = "${name}"`;

const scheduleAll = () => `select sch.sched_id, sch.name, sch.day, sch.time, count(r.sid) numScripts from Schedule sch left join Run r on sch.sched_id = r.sched_id group by sch.sched_id`;

const scheduleCreate = (name, day, time) => `insert into Schedule (name, day, time) values ("${name}", "${day}", "${time}")`;

const scheduleUpdate = (schId, name, day, time) => `update Schedule set name = "${name}", day = "${day}", time = "${time}" where sched_id = ${schId}`;

const scheduleUpdateName = (schId, name) => `update Schedule set name = "${name}" where sched_id = ${schId}`;

const scheduleUpdateDay = (schId, day) => `update Schedule set day = "${day}" where sched_id = ${schId}`;

const scheduleUpdateTime = (schId, time) => `update Schedule set time = "${time}" where sched_id = ${schId}`;

const scheduleAddScripts = (schId, sids) => {
  var q = `insert into Run (sched_id, script_order, sid, db) values `
  for (var order = 1; order <= sids.length; order++) q += `(${schId}, ${order}, ${sids[order - 1]}, "DDDB2016Aug"),`;
  return q.slice(0, -1)
}

const scheduleDeleteScripts = (schId) => `delete from OverlordDB.Run where sched_id = ${schId}`;

const scheduleDelete = (schId) => `delete from OverlordDB.Schedule where sched_id = ${schId}`;

const scheduleGetScripts = (schId) => `select s.sid, s.name from Run r join Script s on s.sid = r.sid where sched_id = ${schId}`

exports.getSchedules = (cb) => Conn.getConn().query(scheduleAll(), (err, data) => cb(DaoHelper.formatNulls(data)));

exports.getManageSchedule = (schId, cb) => {
  Conn.getConn().query(scheduleGetId(schId), (err, schedule) => {
    Conn.getConn().query(scheduleGetScripts(schId), (err, scripts) => {
      const time = schedule[0]['time'].split(':')
      cb(schedule[0]['name'], schedule[0]['day'], time[0], time[1], time[2], scripts)
    });
  });
}

exports.createSchedule = (name, day, time, cb) => {
  Conn.getConn().query(scheduleGetName(name), (err, data) => {
    if (data.length == 0) Conn.getConn().query(scheduleCreate(name, day, time), (err, data) => {});
  });
}

exports.updateScheduleName = (schId, name) => {
  Conn.getConn().query(scheduleGetId(schId), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scheduleUpdateName(schId, name), (err, data) => {});
  });
}

exports.updateScheduleDay = (schId, day) => {
  Conn.getConn().query(scheduleGetId(schId), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scheduleUpdateDay(schId, day), (err, data) => {});
  });
}

exports.updateScheduleTime = (schId, time) => {
  Conn.getConn().query(scheduleGetId(schId), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scheduleUpdateTime(schId, time), (err, data) => {});
  });
}

exports.updateScheduleSids = (schId, sids) => {
  Conn.getConn().query(scheduleGetId(schId), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scheduleDeleteScripts(schId), (err, data) => {
      Conn.getConn().query(scheduleAddScripts(schId, sids), (err, data) => {});
    });
  });
}

exports.deleteSchedule = (schId, cb) => {
  Conn.getConn().query(scheduleGetId(schId), (err, data) => {
    if (data.length == 1) Conn.getConn().query(scheduleDeleteScripts(schId), (err, data) => {
      Conn.getConn().query(scheduleDelete(schId), (err, data) => {});
    });
  });
}
