var fs = require('fs');
var options = {
  key: fs.readFileSync('/home/ubuntu/ssl/worldofpvp.key'),
  cert: fs.readFileSync('/home/ubuntu/ssl/4419057c98337.crt'),
  ca: fs.readFileSync('/home/ubuntu/ssl/gd_bundle-g2-g1.crt')
};
var app = require('https').createServer(options, handler);
var io = require('socket.io').listen(app);
//var mongoose = require('mongoose');
var playerlist = [];
var gamename = null;
io.set('log level', 1);
app.listen(8080);

// connect mongodb 
/*mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
db.once('open', function callback () {
  console.log('mongodb connection On');
});

var playerSchema = mongoose.Schema({
  name: String, 
  gold: String,
});

var Player = mongoose.model('Player', playerSchema);*/
//var newPlayer = new Player({ name: 'Jumper', gold: '11' });

/*newPlayer.save(function (err, fluffy) {
  if (err) {

  }
  console.log('player ' + newPlayer.name + ' saved in the db');
});*/
/*var searchPlayer = Player.find({ name: /^Jumper/ });
console.log(searchPlayer.name);*/

// end mongodb

function handler (req, res) {
  fs.readFile(__dirname + '/index.php',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.php');
      }
      res.writeHead(300);
      res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
  socket.on('sendName', function (data) {
    var playername = (data.playername);
  });

  socket.on('recievedata', function (positionx, positiony, currentanimation, gamename, aimAngle, currentWeaponId, currentHidden, remoteShoot, health) {
    socket.broadcast.emit('playermove', positionx, positiony, currentanimation, gamename, aimAngle, currentWeaponId, currentHidden, remoteShoot, health);
  });

// recieve killed state
socket.on('health', function (health, gamename) {
  socket.broadcast.emit('playerhealth', health, gamename);
});

// Recive gamename from player.js
socket.on('initializeplayer', function (newplayername) {
  socket.clientname = newplayername;
  playerlist.push(newplayername);
  console.log("player " + newplayername + " joined the game");

// Tell all clients to run function addplayer and pass them playerlist + newplayername
io.sockets.emit('addplayer', playerlist, newplayername);
});

socket.on('disconnect', function() {
  delete playerlist[socket.clientname];
  for(var i in playerlist) {
    if(playerlist[i] == socket.clientname) {
      playerlist.splice(i, 1);
    }
  }

  socket.broadcast.emit('message', socket.clientname);
  socket.broadcast.emit('netreplayer', playerlist);

});

});