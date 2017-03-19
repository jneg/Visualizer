const _ = require('lodash')
const ndt = require('node-datetime')

exports.formatDates = (rows, date) => {
  return _.each(rows, (row) => {
    if (row[date] !== null) row[date] = ndt.create(row[date], 'Y-m-d H:M:S').format();
  });
}

exports.formatNulls = (rows) => {
  return _.each(rows, (row) => {
    _.each(row, (val, key) => {
      if (val === null) row[key] = 'None';
    });
  });
}
