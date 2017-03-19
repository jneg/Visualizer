const Express = require('express');
const Session = require('express-session');
const BodyParser = require('body-parser');
const execFile = require('child_process').execFile;
const Map = require('./Dao/Map');
const Schedule = require('./Dao/Schedule');
const Script = require('./Dao/Script');
const Journal = require('./Dao/Journal');

const server = Express();
server.use(BodyParser.json())
server.use(Session({secret: 'frizzle', resave: 'false', saveUninitialized: 'false'}));
server.use('/images', Express.static('Images'))
server.use('/js', Express.static('Js'))
server.use('/css', Express.static('Css'))
server.get('/auth/:code', (req, res) => {
  if (req.params.code === 'coronado') req.session.authorized = true;
  res.redirect('/auth');
});
server.get('/auth', (req, res) => {
  if (req.session.authorized === true) res.redirect('/');
  else res.sendFile(__dirname + '/Vue/Auth.html');
});
server.get('*', (req, res, next) => {
  if (req.session.authorized === true) next();
  else res.redirect('/auth');
});
server.get('/', (req, res) => res.sendFile(__dirname + '/Vue/Home.html'));
server.get('/live', (req, res) => res.sendFile(__dirname + '/Vue/Visualizer.html'));
server.get('*', (req, res) => res.sendFile(__dirname + '/Vue/404.html'));

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
});

const port = 80;
httpServer.listen(port, () => console.log('DW Server listening on port ' + port));
