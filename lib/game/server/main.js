// SERVER main.js

ig.module(
    'game.server.main'
    )
.requires(
    'game.base',
    'plugins.server',
    'game.levels.field',
    'game.levels.arena2',
    'game.server.entities.player',
    'game.server.entities.crate',
    'plugins.box2d.game'
    )
.defines( function () {

// This handles all the network logic and is now seperated from the game class.
// You can access this instance at ig.server.
MyServer = Server.extend({

//================================================================================

clientConnected: function ( socket ) {
// Must call the parent class to intialize the network functionality.
this.parent( socket );
ig.game.spawnEntity( EntityPlayer, 600, 200, { socket: socket });
}
});

MyGame = GameServer.extend({
    gravity: 400,

    init: function () {
        this.loadLevel( LevelArena2 );
        ig.game.spawnEntity( EntityCrate, 600, 200 );

        //console.log(base.levelSize().x);
    },

    getPos: function ( EntityName ) {
        var entity = ig.game.getEntitiesByType("ig." + EntityName);
        return entity;
    },
});

ig.main( '#canvas', MyGame, 60, 100, 100, 1 );
ig.system.setServer( MyServer );
});
