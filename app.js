require('./lib/game/utils.js');

var impact = require('./server/impact-crater');
var MongoClient = require('mongodb').MongoClient;


// Connect to the db
MongoClient.connect('mongodb://localhost:27017/wop', function(err, db) {
  if(!err)
  {
    Canv.line;
  }
  else
  {
    console.log(err);
  }

  var collection = db.collection('player');
  var pStats = {
    fID: '5435tn4jbyh65',
    name: 'Yanko Alexandrov',
    expirience: 0,
    lastLogin: 0,
    timePlaying: 0,
    score: 0,
    gold: 0,
    wins: 0,
    kills: 0,
    deaths: 0,
    killstreak: 0,
    winstreak: 0
  };

  collection.insert(pStats, {w:1}, function(err, result) {});
});


// MongoDB End
/*
    impact.web -> The express web server. You can add additional paths if you want.
     impact.ig -> The impactjs namespace. If you are doing any database stuff attach the 
                  database here and use it within your server code.
     impact.io -> The socket.io namespace. You can attach additional event handlers here
                  but I recommend attaching socket event handlers in your GameServer class.
                  Refer to the plugins/server.js:GameServer class for attaching additional socket
                  event handlers.

    Example of showing the clients in the game via host/clients.
    impact.web.get('/clients', function(req, res) {
        var list = '';
        // Build a list of clients
        var clients = impact.ig.game.clients;
        for (var index in clients)
            list += '<li>' + clients[index].handshake.address.address + ': ' + clients[index].id + '</li>'; 
        // Send the output to the client.
        res.send([
            '<h2>', Object.keys(impact.ig.game.clients).length, ' client(s) in the game.</h2>',
            '<ul>', list, '</ul>'
        ].join(''));
    });

    Finally after setup start your game.
*/

impact.start();