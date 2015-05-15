ig.module(
	'game.base'
	).requires(
	'impact.game',
	'plugins.box2d.game',
	'plugins.server'
	)
	.defines(function () {

//=======================================================================================================
// Vector

Vec.Pg = function (gpos)
{
	return vec(Lg(gpos.x), Lg(gpos.y));
}

Vec.Pc = function (cpos)
{
	return vec(Lc(cpos.x), Lc(cpos.y));
}

Vec.gP = function (pos)
{
	return vec(gL(pos.x), gL(pos.y));
}

//=======================================================================================================

get_level_size = function ()
{
	var tile_csize = ig.game.collisionMap.tilesize;

	var cwidth = ig.game.collisionMap.width * tile_csize;
	var cheight = ig.game.collisionMap.height * tile_csize;

	return vec(Lc(cwidth), Lc(cheight));
}

get_map_rect = function ()
{
	return rect(pos(Lc(0), Lc(0)), get_level_size());
}

/*
is_out_of_map =  function (pos)
{
	return ! get_map_rect().extend_margin(Lc(500)).is_pos_in(pos);
}
/**/

//=======================================================================================================

// event
// state

StateEntity = EntityServer.extend ({
	// Impact ----------------------------------------
	// Box2D -----------------------------------------

	update: function ()
	{ var _ = this;
		_.parent();

		// check out of map bounds
		if (! get_map_rect().extend_margin(Lc(500)).is_pos_in(pos))
			_.kill();
	}

	// WoP -------------------------------------------

	state: 'idle',

});


//=======================================================================================================

DynamicEntity = EntityServer.extend ({

	//================================================================================

	// Impact ----------------------------------------

	// Overriden by Box 2d, set to "none" for impact
	type: ig.Entity.TYPE.STATIC,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,

	// Box2D -----------------------------------------

	//init: function ( x, y, settings ) {}

	update: function ()
	{ var _ = this;
		_.parent();

		// check out of map bounds
		if (! get_map_rect().extend_margin(Lc(500)).is_pos_in(pos))
			_.kill();
	}

	// WoP -------------------------------------------

});

//=======================================================================================================

/*glenc = function (x) {
	return x * b2.SCALE;
};
cleng = function (x) {
	return x / b2.SCALE;
};
glens = glenc;
sleng = cleng;
clens = func_id;
slenc = func_id;

leng = func_id;
lenc = glenc;
lens = glenc;

glen = func_id;
clen = cleng;
slen = cleng;

//=======================================================================================================

screen_cpos = function () {
	return vecCopy(ig.game.screen);
};
screenSize_cvec = function () {
	return vec(window.innerWidth, window.innerHeight);
};

//=======================================================================================================

gvecc = function (x, y) 
{
	if (y !== undef) x = vec(x, y);
	return vecScale(x, b2.SCALE);
};
cvecg = function (x, y) 
{
	if (y !== undef) x = vec(x, y);
	return vecScale(x, 1 / b2.SCALE);
};
gposc = function (x, y) {
	return gvecc(x, y);
};
cposg = function (x, y) {
	return cvecg(x, y);
};
cposs = function (x, y) {
	if (y !== undef) x = vec(x, y);
	return vecAdd(x, screen_cpos());
};
sposc = function (x, y) {
	if (y !== undef) x = vec(x, y);
	return vecSub(x, screen_cpos());
};
sposg = function (x, y) {
	return sposc(cposg(x, y));
};
gposs = function (x, y) {
	return gposc(cposs(x, y));
};


posg = function (x, y) {
	if (y !== undef) x = vec(x, y);
	return x;
};
posc = gposc;
poss = gposs(x, y);
gpos = func_id;
cpos = cposg;
spos = sposg;

vecg = posg;
vecc = gvecc;
gvec = func_id;
cvec = cvecg;

vecs = vecc;
svec = cvec;

//=======================================================================================================

screenCenter_spos = function () {
	return vecScale(cV_screenSize(), 0.5);
};
screenCenterPos = function () {
	return poss(screenCenter_spos);
};

mouse_spos = function () {
	return ig.input.mouse.x, ig.input.mouse.y;
};
mousePos = function () {
	return poss(mouse_spos());
};

player_gpos = function () {
		return ig.game.player.body.GetWorldCenter(); // !
	};
	playerPos = function () {
		return posg(player_gpos());
	};
	
	player_mouse_gvec = function () {
		return vecSub(gposs(mouse_spos()), player_gpos());
	};
	vec_player_mouse = function () {
		return vecSub(mousePos(), playerPos());
	};
	
	set_screenCenter = function (x, y) {
		if (y === undef) {
			y = x.y;
			x = x.x;
		}
		ig.game.screen.x = cpos(x) - window.innerWidth / 2;
		ig.game.screen.y = cpos(y) - window.innerHeight / 2;
	};
	shift_screen = function (x, y) {
		if (y === undef) {
			y = x.y;
			x = x.x;
		}
		ig.game.screen.x += cpos(x);
		ig.game.screen.y += cpos(y);
	};

	
//=======================================================================================================
spawnEntity = function (entity, pos, settings) {
	return ig.game.spawnEntity(entity, pos.x, pos.y, settings);
};

spawnCanv = function (settings) {
	return ig.game.spawnEntity(EntityCanv, 0, 0, settings);
};

spawnLine = function (beg, end, style) {
	return spawnCanv({style:style, beg:beg, end:end,
		draw: function(_) {
			_.canv.line(spos(_.beg), spos(_.end));
		}});
};
spawnVec = function (beg, end, style) {
	return spawnCanv({style:style, beg:beg, end:end,
		draw: function(_) {
			_.canv.vec(spos(_.beg), spos(_.end));
		}});
};
spawnVecHead = function (beg, end, style) {
	return spawnCanv({style:style, beg:beg, end:end,
		draw: function(_) {
			_.canv.vec_head(spos(_.beg), spos(_.end));
		}});
};
spawnRect = function (beg, size, style) {
	return spawnCanv({style:style, beg:beg, size:size,
		draw: function(_) {
			_.canv.rect(spos(_.beg), svec(_.size), (_.style ? _.style.fill : false));
		}});
};
spawnCircle = function (pos, r, style) {
	return spawnCanv({style:style, pos:pos, r:r,
		draw: function(_) {
			_.canv.circle(spos(_.pos), slen(_.r), (_.style ? _.style.fill : false));
		}});
};

//=======================================================================================================

Pool = {
	entities: undef,

	kill: function () { var _ = this;
		foreach(_.entities, function (i, entity) {
			entity.kill();
		});
		_.entities = [];
	}

	add: function (entity) {
		this.entities.push(entity);
		return entity;
	}
};

makePool = function (entities) {
	return proto({entities:(entities ? entities : [])}, Pool);
};

//=======================================================================================================

RayCast = {
	beg: _init_,
	end: _init_,

	init = function (beg, end) { var _ = this;

	},

	fixture: _o_,

	fraction_hit: _o_,
		point_hit: _o_, // auto calc-able

		fraction_exit: _o_, // auto calc-able
		point_exit: _o_, // auto calc-able

		normal: _o_,
		
		next: function () { var _ = this;
		}
		
	};

	rayCast = function (beg, end) {
		var collision = undef;
		var callback = function (fixture, point, normal, fraction) {
			collision = {fixture: fixture, beg: point, normal:normal, fraction:fraction};
			return fraction;
		}
		ig.world.RayCast(callback, beg, end);
		return collision;
	};
	
	rayCastCollect = function (beg, end) {
		var collisons = [];
		var callback = function (fixture, point, normal, fraction) {
			//if (! fixture.IsSensor())
			collisons[collisons.length] = {fixture: fixture, beg: point, normal:normal, fraction:fraction};
			return 1;
		}
		ig.world.RayCast(callback, beg, end);
		collisons.sort(function (r1, r2) { return r1.fraction - r2.fraction; });
		return collisons;
	};
	
	add_collision_end = function (collision, beg, end) {
		var output = new b2.RayCastOutput();
		var input = new b2.RayCastInput(end, beg, 1);
		var hit = collision.fixture.RayCast(output, input);
		collision.end_fraction = 1 - (hit ? output.fraction : 0);
		if (hit)
			collision.end_normal = output.normal;
		collision.end = posFrac(beg, end, collision.end_fraction);
	};

//=======================================================================================================

queryAABB = function (aabb) {
	var fixtures = undef;
	var callback = function (fixture) {
		return true;
	}
	ig.world.QueryAABB(callback, aabb);
	return fixtures;
}

//=======================================================================================================

BulletSimulator = {
	fluid_density: Mkg(1.23) / pow(Lm(1), 3),

	body_drag: _i_,
	max_dist: _i_,
	min_vel: _i_,

	init0: function () { var _ = this;
			// init get_dist_vel table
		},
		
		get_dist_vel: function (vel) { var _ = this;
		},
		
		pos: _io_,
		vel: _io_,
		
		dist: _io_,
		
		shoot: function () { var _ = this;
			var ds = dragSimulator({
				step_dist: Lcm(10),
				fluid_density: fluid_density,
				body_drag: body_drag
			});
			ds.step_while(function (ds) {
				var cont = true;
				if (ds.vel - ds.dvel <= _.min_vel)
				{
					ds.step_delta_to_vel(_.min_vel);
					cont = false;
				}
				if (ds.dist + ds.ddist > dist)
				{
					ds.step_delta_to_dist(dist);
					cont = false;
				}
				return cont;
			});			
		},

		shoot_collide: function () { var _ = this;
			var collision = 
		}
		
		collision: _o_
	};

//=======================================================================================================
BulletSimulator = {
	max_dist: _i_,

	body_drag: _i_,
	min_vel: _i_,

	init: function (pos, vel) { var _ = this;
		_.pos = pos;
		_.vel = vel;
	}

	shoot: function (beg, vel) { var _ = this;
		var ds = dragSimulator({
			step_dist: Lc(60),
			fluid_density: density_air,
			body_drag: _.body_drag,
		});

		var end = vecAdd(beg, vecScaleTo(vel, _.max_dist));
		var res = rayCastCollect(beg, end);
		var i = 0;

		ds.start(Lvec(vel));

		var pos = beg;
		while (true)
		{
			var ri = (i < res.length ? res[i] : {});
			var dist = Lvec(vecSub(i < res.length : ri.beg ? end, beg));
			var reach = false;
			ds.step_while(function (ds) {
				var cont = true;
				if (ds.vel - ds.dvel <= _.min_vel)
				{
					ds.step_delta_to_vel(_.min_vel);
					cont = false;
				}
				if (ds.dist > dist)
				{
					ds.step_delta_to_vel(_.min_vel);
					cont = false;
					reach = true;
				}
				return cont;
			});
			var vel = vecScaleTo(vel, ds.vel);
			_.travel_air(_, pos, vel, ri);
			if (! reach)
				break;
			if (reach)
			{
				_.hit(_, ri);
			}
			++ i;
		}
		var collide
	}

	air_travel: function (_, ) {
	}

	hit: function () {
	}
};
//=======================================================================================================
Bullet = {
	body_drag: _i_,
	min_vel: _i_,
	
	diameter: _i_,
	mass: _i_,
	drag_coeff: _i_,
	head_hardness: _i_

};

shootBullet = function (bullet, pos, vel) {
	var len_vel = Lvec(vel);
	var ds = dragSimulator({
				//step_dist: Lc(60),
				fluid_density: density_air,
				body_drag: bullet.body_drag,
			});

	ds.step_dist = Lc(240);
	ds.start(len_vel);
	ds.step_to_vel(bullet.min_vel);

	var end = vecAdd(pos, vecScaleTo(vel, ds.dist));

	var res = rayCastCollect(pos, end);

	ds.step_dist = Lc(60);
	ds.start(len_vel);

};
//=======================================================================================================*/
});
