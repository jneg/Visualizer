const Express = require('express');
const Pug = require('pug')
const Session = require('express-session');
const BodyParser = require('body-parser');
const execFile = require('child_process').execFile;
const Map = require('./Dao/Map');
const Schedule = require('./Dao/Schedule');
const Script = require('./Dao/Script');
const Journal = require('./Dao/Journal');
const ScriptHistory = require('./Dao/ScriptHistory');

const server = Express();
server.use(BodyParser.json())
server.use(Session({secret: 'frizzle', resave: 'false', saveUninitialized: 'false'}));
server.use('/images', Express.static('Images'))
server.use('/js', Express.static('Js'))
server.use('/bundles', Express.static('Bundles'))
server.get('/auth/:code', (req, res) => {
  if (req.params.code === 'coronado') req.session.authorized = true;
  res.redirect('/auth');
});
server.get('/auth', (req, res) => {
  if (req.session.authorized === true) res.redirect('/');
  else res.send(Pug.renderFile(__dirname + '/Pug/Auth.pug'));
});
server.get('*', (req, res, next) => {
  if (req.session.authorized === true) next();
  else res.redirect('/auth');
});
server.get('/', (req, res) => res.send(Pug.renderFile(__dirname + '/Pug/Home.pug')));
server.get('/live', (req, res) => res.send(Pug.renderFile(__dirname + '/Pug/Visualizer.pug')));
server.get('*', (req, res) => res.send(Pug.renderFile(__dirname + '/Pug/404.pug')));

const httpServer = require('http').createServer(server);
const io = require('socket.io').listen(httpServer);
io.on('connection', function (socket) {
  const overlord = '/home/jnegahba/Overlord/Overlord.py';
  const sendModel = () => {
    Map.getMap((map) => socket.emit('map', map));
    Schedule.getSchedules((schedules) => socket.emit('schedules', schedules));
    Script.getScripts((scripts) => socket.emit('scripts', scripts));
    Journal.getJournal((journal) => socket.emit('journal', journal));
  };
  sendModel();
  setInterval(sendModel, 1000);

  socket.on('createSchedule', (data) => {
    if (data.hasOwnProperty('name') && data.hasOwnProperty('day') && data.hasOwnProperty('time')) Schedule.createSchedule(data.name, data.day, data.time, () => {});
  });

  socket.on('updateSchedule', (data) => {
    if (data.hasOwnProperty('schId') && data.hasOwnProperty('name') && data.hasOwnProperty('day') && data.hasOwnProperty('time') && data.hasOwnProperty('sids')) Schedule.updateSchedule(data.schId, data.name, data.day, data.time, data.sids, () => {});
  });

  socket.on('deleteSchedule', (data) => {
    if (data.hasOwnProperty('schId')) Schedule.deleteSchedule(data.schId, () => {});
  });

  socket.on('executeSchedule', (data) => {
    if (data.hasOwnProperty('schId')) execFile(overlord, ['schedule', data.schId], () => {});
  });

  socket.on('createScript', (data) => {
    if (data.hasOwnProperty('name') && data.hasOwnProperty('path') && data.hasOwnProperty('state')) Script.createScript(data.name, data.path, data.state, () => {});
  });

  socket.on('updateScript', (data) => {
    if (data.hasOwnProperty('sid') && data.hasOwnProperty('name') && data.hasOwnProperty('path') && data.hasOwnProperty('state') && data.hasOwnProperty('current')) Script.updateScript(data.sid, data.name, data.path, data.state, data.current, () => {});
  });

  socket.on('deleteScript', (data) => {
    if (data.hasOwnProperty('sid')) Script.deleteScript(data.sid, () => {});
  });

  socket.on('executeScript', (data) => {
    if (data.hasOwnProperty('sid')) execFile(overlord, ['script', data.sid], () => {});
  });

  socket.on('historyScript', (data) => {
    if (data.hasOwnProperty('sid')) ScriptHistory.getScriptHistory(data.sid, (scriptHistory) => socket.emit('scriptHistory', scriptHistory));
  });
});

const port = 80;
httpServer.listen(port, () => console.log('DW Server listening on port ' + port));
