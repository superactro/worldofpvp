// SERVER player.js 

ig.module(
	'game.server.entities.player'
).requires(
	'plugins.box2d.entity'
)
.defines( function ()
{
	EntityPlayer = DynamicEntity.extend ({

		//================================================================================

		// Impact ----------------------------------------

		//type: ig.Entity.TYPE.A,

		size:
		{
			x: 16,
			y: 28
		},

		// Offest of entity anim in Impact to Box2d body center of mass
		offset:
		{
			x: 4,
			y: 4
		},

		// Box 2D ----------------------------------------

		friction:
		{
			x: 100,
			y: 100
		},

		density: 100,

		isFixedRotation: true,

		init: function ( x, y, settings )
		{ var _ = this;
			assert(_);
			_.parent( x, y, settings );

			_.input.bind( ig.KEY.W, 'jump' );
			_.input.bind( ig.KEY.A, 'left' );
			_.input.bind( ig.KEY.S, 'down' );
			_.input.bind( ig.KEY.D, 'right' );

			_.input.bind( ig.KEY.Up, 'jump' );
			_.input.bind( ig.KEY.Left, 'left' );
			_.input.bind( ig.KEY.Down, 'down' );
			_.input.bind( ig.KEY.Right, 'right' );
		},

		// only PlayerEntity event handles
		update: function ()
		{ var _ = this;
/*			_.parent();
			// input --> events
			// (state , [events]) logic

			if      ('kill' in events)
				kill();
			else if (state ==== )
			// ...
*/		},

		// WoP -------------------------------------------

		events: [],

		push_event: function (event)
		{
			// event --> entents
		}

		health: 100,

		startVel: 200,

		state: 'idle',

		idle: function (event)
		{
			if (event === '')
		},

		idle__jump: function () {
			_set_state('air');

			_.vel.y -= 1000;
			// ...
		},

		state_1__jump: functio

		// movement
		jump: function ()
		{ var _ = this;
			this.anim = 'jump';
			this.vel.y = -this.st;
		},

		go_left: function () {
			this.anim = 'left';
			this.vel.x = -this.startVel;
		},

		go_right: function () {
			this.anim = 'right';
			this.vel.x = this.startVel;
		},

		idle: function () {
			if ( this.vel.x == 0 && this.vel.y == 0 ) this.anim = 'idle';
		},
	});
});
