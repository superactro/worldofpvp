ig.module('game.ig')
.requires(
	'impact.system',
	'impact.game'
)
.defines(function() {

	console.log("ig::: " + ig);
	console.log("ig.system:::" + ig.system);
	install_canvas_funcs(ig.system.context);

	ig.ctxPos = function (v) {
		var x = ig.system.getDrawPos(v.x - ig.game.screen.x);
		var y = ig.system.getDrawPos(v.y - ig.game.screen.y);
		return vec(x, y);
	}

});