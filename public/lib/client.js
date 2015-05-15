function client(name) {
  var port = 8080;
  this.socket = io.connect('//localhost:' + port, {
    'reconnect' : true,
    'reconnection delay' : 100,
    'max reconnection attempts' : 10
  });

  this.playername = name;
  console.log('player name: ' + playername);
  socket.emit('sendName', { playername: playername });
  /*} */

// send the player name to the server

socket.on('message', function (data) {
  var player = ig.game.getEntitiesByType( EntityPlayer )[0];
  if(player) {
    player.messagebox = player.messagebox + '\n' + data + ' disconnected!';
  }
});


socket.on('playermove', function (remotePos, currentanimation, thisgamename, currentaimAngle, currentWeaponId, currentHidden, remoteShoot, health) { 

  if (ig.game) {
    var networkplayer = ig.game.getEntitiesByType( EntityNetworkplayer );
  }
// Looping thro all players and searching for this player - thisgamename, then sending the x and y pos
for(var i in networkplayer) {
  if (thisgamename == networkplayer[i].gamename) {
    networkplayer[i].remotePos = remotePos;
    networkplayer[i].aimAngle = currentaimAngle;
    networkplayer[i].currentanimation = currentanimation;
    networkplayer[i].currentWeaponId = currentWeaponId;
    networkplayer[i].hidden = currentHidden;
    networkplayer[i].remoteShoot = remoteShoot;
    networkplayer[i].health = health;
  }}
}); 

socket.on('playerhealth', function (health, gamename) { 

  var player = ig.game.getEntitiesByType( EntityPlayer );
  for(var i in player) {
    if (gamename == player[i].gamename) {
      player[i].health = health;
    }}

  });

socket.on('netreplayer', function (playerlist) {

  var networkplayer = ig.game.getEntitiesByType( EntityNetworkplayer );

  if (EntityNetworkplayer[i]) {
    for (var i in networkplayer) {
// Find the name of the disconnected player and kill All Entities
networkplayer[i].kill();   
}
}

// Then rebuild all exept the disconnected player
for(var i in playerlist) {
  if (playername != playerlist[i]) {
    ig.game.spawnEntity( EntityNetworkplayer , 0, 0, {
      gamename:playerlist[i]
    });
  }
}
});

socket.on('addplayer', function (playerlist, networkplayername) {

  var player = ig.game.getEntitiesByType( EntityPlayer )[0];
  if (player != undefined) {
    player.messagebox = player.messagebox + '\n' + networkplayername + ' joined the game.';
  }

  if (player) {
    for (var i = 0; i < playerlist.length; i++) {

      if (player.gamename != playerlist[i]) {
// Give the New Player the name from playerlist
ig.game.spawnEntity ( EntityNetworkplayer, 160, 260, {
  gamename: playerlist[i]
});
}}  
}
});
};

