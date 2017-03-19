exports.sidToRow = (sid) =>
 `select * from OverlordDB.Script s where s.sid = ${sid}`

exports.stateAbbrToRow = (state) =>
 `select * FROM OverlordDB.State st where st.abbr = '${state}'`

exports.scheduleIdToRow = (sched_id) =>
 `select * from OverlordDB.Schedule sch where sch.sched_id = ${sched_id}`

exports.stateTables = (state) =>
 `select ddt.tid, ddt.name 'table', srs.end_time 'last_modified', srs.status from OverlordDB.DD_Table ddt left join OverlordDB.TableStatus ts on ts.tid = ddt.tid left join OverlordDB.TableStatus ts2 on ts.tid = ts2.tid and ts.hid < ts2.hid left join OverlordDB.ScriptRunSummary srs on srs.hid = ts.hid left join OverlordDB.Script s ON srs.sid = s.sid where ts2.hid is null and s.state = 'NY'`

exports.stateTableRunHistory = (state, table) =>
 `select srs.end_time date, srs.status, s.name script, srs.exec_type, ts.inserted, ts.modified, ts.deleted from OverlordDB.Script s join OverlordDB.ScriptRunSummary srs on srs.sid = s.sid join OverlordDB.TableStatus ts on srs.hid = ts.hid join OverlordDB.DD_Table ddt on ts.tid = ddt.tid where s.state = '${state}' and ddt.name = '${table}' and s.current = true order by date desc`

/* Schedules */

exports.allSchedules = () =>
 `select sch.sched_id, sch.name, sch.day, sch.time, count(r.sid) numScripts from OverlordDB.Schedule sch left join OverlordDB.Run r on sch.sched_id = r.sched_id group by sch.sched_id`

exports.scheduleScripts = (scheduleId) =>
 `select s.sid, r.script_order, s.name from OverlordDB.Schedule sch join OverlordDB.Run r on sch.sched_id = r.sched_id join OverlordDB.Script s on r.sid = s.sid where sch.sched_id = ${scheduleId} order by r.script_order asc`

exports.createSchedule = (scheduleName) =>
 `insert into OverlordDB.Schedule (name, day, time) values ("${scheduleName}", "Daily", "00:00:00")`

exports.updateSchedule = (scheduleId, scheduleName, day, time) =>
 `update OverlordDB.Schedule set name = "${scheduleName}", day = "${day}", time = "${time}" where sched_id = ${scheduleId}`

exports.addScheduleScripts = (scheduleId, sids) => {
  var updateQuery = `insert into OverlordDB.Run (sched_id, script_order, sid, db) values `
  for (var order = 1; order <= sids.length; order++) {
    updateQuery += `(${scheduleId}, ${order}, ${sids[order - 1]}, "DDDB2016Aug"),`
  }

  return updateQuery.slice(0, -1)
}

exports.deleteScheduleScripts = (scheduleId) =>
 `delete from OverlordDB.Run where sched_id = ${scheduleId}`

exports.deleteSchedule = (scheduleId) =>
 `delete from OverlordDB.Schedule where sched_id = ${scheduleId}`

/* Scripts */

exports.allScripts = () =>
 `select s.sid, srs.status, s.name, s.path, s.state from OverlordDB.Script s left join OverlordDB.ScriptRunSummary srs on s.sid = srs.sid left join OverlordDB.ScriptRunSummary srs2 on srs.sid = srs2.sid and srs.hid < srs2.hid where srs2.hid is null`

exports.scriptHistory = (sid) =>
 `select srs.status, srs.hid, srs.start_time, srs.end_time, srs.exec_type, srs.notes from OverlordDB.Script s join OverlordDB.ScriptRunSummary srs on s.sid = srs.sid where s.sid = ${sid} order by srs.hid desc`
