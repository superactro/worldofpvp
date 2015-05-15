// CLIENT main.js
ig.module(
	'game.main'
)
.requires(
	'plugins.client',
	'game.levels.field',
	'game.levels.arena2',
	'game.entities.player',
	'game.entities.crate'
)
.defines(function() {
	var sWidth = window.innerWidth;
	var sHeight = window.innerHeight;
	// This handles all the network logic and is now seperated from the game class.
	// You can access this at ig.client.
	MyClient = Client.extend({
	});

	MyGame = GameClient.extend({
		init: function() {
			ig.game.clearColor = '#000';
			this.loadLevel(LevelArena2);
		}
	});

	ig.main('#canvas', MyGame, 60, sWidth, sHeight, 1);
	ig.system.setClient(MyClient);
});
