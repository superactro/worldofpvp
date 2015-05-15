//=======================================================================================================
// Basic
_i_ = undefined;
_init_ = undefined;
_o_ = undefined;
_io_ = undefined;

undef = undefined;

func_null = function () {};

func_id = function (x) {
	return x;
};

//=======================================================================================================
// Debug

function assert (condition, message) {
	if (!condition)
		throw message || "Assertion failed";
}

//=======================================================================================================
// Math

PI = Math.PI;

sqr = function (x) {
	return x * x;
};

sqrt = Math.sqrt;
pow = Math.pow;

function circle_area (r) {
	return PI * r * r;
}

FuncGraph = {

	x0: _i_,
	xn: _i_,
	fi: _i_,

	init: function () { var _ = this;
		_.step = (xn - x0) / _.fi.length;
		_.fi.push(_.fi[_.fi.length - 1]); // for "fmax" not to check the bounds
	},

	step: _o_,
	
	geti: function (x) { var _ = this;
		assert(x >= _.x0);
		assert(x <= _.xn);
		return Math.floor((x - _.x0) / _.step);
	},
	
	f: function (x) { var _ = this;
		var i = _.geti(x);

		var xi = _.x0 + i * _.step;
		var xi1 = xi + _.step;

		var fi = _.fi[i];
		var fi1 = _.fi[i + 1];
		
		var fx = fi + ((x - xi) / (xi1 - xi)) * (fi1 - fi);

		return fx;
	},
	
	f_left: function (x) { var _ = this;
		return _.fi[_.geti(x)];
	},

	f_right: function (x) { var _ = this;
		return _.fi[_.geti(x) + 1];
	},

	f_min: function (x) { var _ = this;
		var i = _.geti(x);
		return Math.min(_.fi[i], _.fi[i + 1]);
	},

	f_max: function (x) { var _ = this;
		var i = _.geti(x);
		return Math.max(_.fi[i], _.fi[i + 1]);
	},
};

funcGraph = function (ctx) {
	return proto(ctx, FuncInterpolation);
}

//=======================================================================================================
// Dict

function is_dict (obj) {
	return typeof obj === 'object' && obj.__proto__ === Object.prototype;
}

function foreach (dict, func) {
	var prop;
	for (prop in dict) {
		if (dict.hasOwnProperty(prop)) {
			func(prop, dict[prop]);
		}
	}
}

function keys (dict) {
	var res = [];
	foreach(dict, function (prop, val) {
		res.push(prop);
	});
	return res;
}

function copy (dict) {
	var res = {};
	foreach(obj, function (prop, val) {
		res[prop] = val;
	});
	return res;
}

function select (obj, propsArray) {
	var res = {};
	foreach(propsArray, function (i, prop) {
		if (prop in obj)
			res[prop] = obj[prop];
	});
	return res;
}

function inject (dict, obj) {
	foreach(dict, function (prop, val) {
		obj[prop] = val;
	});
	return obj;
}

function update (dict, obj) {
	foreach(dict, function (prop, val) {
		if (prop in obj)
			dict[prop] = obj[prop];
	});
	return dict;
}

function inject_new (dict, obj)
{
	foreach(dict, function (prop, val) {
		if (! (prop in obj))
			obj[prop] = dict[prop];
	});
	return obj;
}

function scope_inject (dict, obj, func) {
	var res;
	var orig = {};
	var dels = [];

	foreach(dict, function (prop, val) {
		if (obj.hasOwnProperty(prop)) {
			orig[prop] = obj[prop];
		} else {
			dels.push(prop);
		}
		obj[prop] = val;
	});
	
	res = func();

	foreach(dels, function (i, prop) {
		delete obj[prop];
	});
	foreach(orig, function (prop, val) {
		obj[prop] = val;
	});
	
	return res;
}

//=======================================================================================================
// Obj

function proto (dict, parent) {
	dict.__proto__ = parent;
	return dict;
}

function clone (obj)
{
	if (typeof obj !== 'object')
	{
		console.error('Trying to clone "' + typeof obj + '"');
		return;
	}
	var res = copy(obj);
	res.__proto__ = obj.__proto__;
	return res;
}

//=======================================================================================================
// Vector

Vec = {
	x: _io_,
	y: _io_,

	add: function (vec)
	{ var _ = this;
		_.x += vec.x;
		_.y += vec.y;
	},

	sub: function (vec)
	{ var _ = this;
		_.x -= vec.x;
		_.y -= vec.y;
	},

	toString: function () {
		return "{x: " + this.x + ", y: " + this.y + "}";
	}
}

function vec (_x, _y) {
	return proto({x:_x,y:_y}, Vec);
}

//vec0 = vec(0,0);

//function vecCopy (v) {
//	return clone(v);
//}

function is_vec (v) {
	return typeof v === 'object' && v.hasOwnProperty('x') && v.hasOwnProperty('y');
}

function select_vec (obj) {
	return vec(obj.x, obj.y);
}

function vecScale (v, scale) {
	return vec(v.x * scale, v.y * scale);
}

function vecAdd (v1, v2) {
	return vec(v1.x + v2.x, v1.y + v2.y);
}

function vecSub (v1, v2) {
	return vec(v1.x - v2.x, v1.y - v2.y);
}

//function vecLen (vec) {
function Lvec (vec) {
	return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function vecScaleTo (v, len) {
	return vecScale(v, len / Lvec(v));
}

function vecNormalize (v) {
	return vecScaleTo(v, 1);
}

function posMid (p1, p2) {
	return vecScale(vecAdd(p1, p2), 0.5);
}

function posFrac (p1, p2, f) {
	return vecAdd(p1, vecScale(vecSub(p2, p1), f));
}

//=======================================================================================================
// Interval

Interval =
{
	beg: _io_,
	end: _io_,

	is_val_in: function (val)
	{
		return (val >= interval.beg) && (val <= interval.end);
	}
	// , ...
};

interval = function (beg, end)
{
	return proto({beg: beg, end: end}, Interval);
};

//=======================================================================================================
// Rect

Rect =
{
	// pos
	top_left: _io_,

	// pos
	bottom_right: _io_,

	get_x_interval: function ()
	{
		return interval(rect.top_left.x, rect.bottom_right.x);
	},

	get_y_interval: function ()
	{
		return interval(rect.top_left.y, rect.bottom_right.y);
	},

	is_pos_in_rect: function (pos, rect)
	{ var _ = this;
		return _.get_x_interval().is_val_in(pos.x) &&
			_.get_y_interval().is_val_in(pos.y);
	},

	extend_margin: function (x, y)
	{ var _ = this;
		if (y === undef)
			y = x;
		var v = vec(x, y);

		_.top_left.sub(v);
		_.bottom_right.add(v);

		return _;
	}
};

rect = function (top_left, bottom_right)
{
	return proto({
			top_left: top_left,
			bottom_right: bottom_right
		}, Rect);
}

//=======================================================================================================
// Physics

Lm = func_id;
mL = func_id;
Lcm = function (x) {
	return x / 100;
}
cmL = function (x) {
	return x * 100;
}
Lmm = function (x) {
	return x / 1000;
}
mmL = function (x) {
	return x * 1000;
}
Lkm = function (x) {
	return x * 1000;
}
kmL = function (x) {
	return x / 1000;
}


Mkg = func_id;
kgM = func_id;
Mg = function (x) {
	return x / 1000;
}
gM = function (x) {
	return x * 1000;
}

density_air = Mkg(1.2922) / pow(Lm(1), 3);
density_water = Mkg(1000) / pow(Lm(1), 3);

DragSimulator = {
	step_dist: Lcm(10),

	fluid_density: density_air,

	drag_coeff: 0.5,
	front_area: _i_,
	body_mass: _i_,

	body_drag: _io_,
	
	init: function () { var _ = this;
		if (!_.body_drag)
			_.body_drag = (_.drag_coeff * _.front_area) / (2 * _.body_mass);
		_.acc_coeff = _.fluid_density * _.body_drag;
	},

	acc_coeff: _o_,
	
	get_acc: function (vel) {
		return - this.acc_coeff * vel * vel;
	},

	get_ddist: function (vel, dvel, dtime) {
		return ((2 * vel + dvel) * dtime) / 2;
	},

	start: function (vel, dist, time) { var _ = this;
		_.vel = vel;
		_.dist = dist || 0;
		_.time = time || 0;
	},

	vel: _io_,
	dist: _io_,
	time: _io_,

	calc_delta: function () { var _ = this;
		var acc = _.get_acc(_.vel);
		_.dtime = _.step_dist / _.vel;
		var dvel_max = _.acc_vel * _.dtime;
		
		var vel_min;
		if (- dvel_max >= _.vel) {
			_.dvel = dvel_max / 2;
			if (_.vel + _.dvel <= 0)
			{
				var dtime = _.vel / acc;
				_.dvel = - _.vel;
				_.ddist = (_.vel * dtime) / 2;
				_.ddist = _.get_ddist(_.vel, _.dvel, dtime);
				return;
			}
		} else {
			vel_min = _.vel - dvel_max;
			var acc_min = _.get_acc(vel_min);
			var dvel_min = acc_min * _.dtime;
			_.dvel = (dvel_min + dvel_max) / 2;
		}
		
		_.ddist = _.get_ddist(_.vel, _.dvel, _.dtime);
	},
	
	dtime: _o_,
	dvel: _o_,
	ddist: _o_,

	step: function () { var _ = this;
		_.time += _.dtime;
		_.vel += _.dvel;
		_.dist += _.ddist;
	},
	
	step_while: function (cond) { var _ = this;
		while (true) {
			_.calc_delta();
			if (! cond(_))
				return;
			_.step();
		}
	},
	
	recalc_delta_to_time: function (time) { var _ = this;
		assert(_.time + _.dtime >= time);
	
		var dtime = time - _.time;
		var dvel = _.dvel * (dtime / _.dtime);

		_.dtime = dtime;
		_.dvel = dvel;
		_.ddist = _.get_ddist(_.vel, dvel, dtime);
	},
	
	recalc_delta_to_vel: function (vel) { var _ = this;
		assert(vel <= _.vel);
		assert(vel >= _.vel - _.dvel);

		var dvel = _.vel - vel;
		var dtime = _.dtime * (dvel / _.dvel);
		
		_.dtime = dtime;
		_.dvel = vel - _.vel;
		_.ddist = _.get_ddist(_.vel, dvel, dtime);
	},
	
	recalc_delta_to_dist: function (dist) { var _ = this;
		assert(dist >= _.dist);
		assert(dist <= _.dist + _.ddist);
		
		var ddist = dist - _.dist;
		var c = _.dvel / _.dtime;
		var dtime = (_.vel + sqrt(sqr(_.vel) - 2 * ddist * c)) / c;
		var dvel = _.dvel * (dtime / _.dtime);
		
		_.dtime = dtime;
		_.dvel = dvel;
		_.ddist = dist - _.dist;
	},
	
	max_time: _i_,
	max_dist: _i_,
	min_vel: _i_,
	
	reset_end: function () { var _ = this;
		_.max_time = undef;
		_.max_dist = undef;
		_.min_vel = undef;
	},
	
	step_to_end: function () { var _ = this;
		_.min_vel = _.min_vel || 0;
		_.step_while(function (_) {
			var cont = true;
			if (_.vel - _.dvel <= _.min_vel)
			{
				_.recalc_delta_to_vel(_.min_vel);
				_.end = 'vel';
				cont = false;
			}
			if (_.max_time && _.time + _.dtime >= _.max_time)
			{
				_.recalc_delta_to_time(_.max_time);
				_.end = 'time';
				cont = false;
			}
			if (_.max_dist && _.dist + _.ddist >= _.max_dist)
			{
				_.recalc_delta_to_dist(_.max_dist);
				_.end = 'dist';
				cont = false;
			}
			return cont;
		});
	},
	
	end: _o_,
	
	step_to_time: function (time) { var _ = this;
		assert(time >= _.time);
		_.reset_end();
		_.max_time = time;
		_.step_to_end();
	},
	
	step_to_vel: function (vel) { var _ = this;
		assert(vel >= 0);
		assert(vel <= _.vel);
		_.reset_end();
		_.min_vel = vel;
		_.step_to_end();
	},
	
	step_to_dist: function (dist) { var _ = this;
		assert(dist >= _.dist);
		_.reset_end();
		_.max_dist = dist;
		_.step_to_end();
	},
	
	get_maxDistOfVel_funcGraph: function (steps) { var _ = this;
		steps = steps || 16;
	
		var min_vel = _.min_vel;
		var max_vel = _.vel;
		var vel_step = (max_vel - min_vel) / steps;
		
		var dists = new Array(steps + 1);
		var i = steps;

		dists[i] = _.dist;
		i -= 1;
	
		for (; i >= 0; i -= 1)
		{
			_.step_to_vel(_.vel - vel_step);
			dists[i] = _.dist - dists[i + 1];
		}
	
		for (i = 1; i <= steps; i += 1)
			dists[i] += dists[i - 1];
	
		return funcGraph({
				x0: min_vel,
				xn: max_vel,
				fi: dists
			});
	},
};

dragSimulator = function (ctx) {
	return proto(ctx, DragSimulator).init();
};



get_DragSimulator_DistVelInterpolation = function (ds, vel_min, vel_max, n) {
	var dist = funcInterpolation({
			x0: vel_min,
			xn: vel_max,
			fi: new Array(n),
		});
	var vel_step = (vel_max - vel_min) / n;
	ds.start(vel_max);
	//for (var i = 0; i < )
}


//=======================================================================================================
// Canvas

Canv = {
	// canv.__proto__ = canvas-context;
	// canv = proto(canv, ctx);

	col: [255, 0, 0, 0.7],
	colFill: [0, 255, 0, 0.5],
	
	alpha: 1,
	
	width: 3,
	cap: true,
	join: true,

	col_to_rgba: function (col) {
		return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (col[3] || 1) + ')';
	},
	
	_set_style: function () { var _ = this;
		if (_.col) {
			_.ctx.strokeStyle = col_to_rgba(_.col);
			_.ctx.fillStyle = _.ctx.strokeStyle;
		}
		if (_.colFill)
			_.ctx.fillStyle = col_to_rgba(_.colFill);
		if (_.alpha)
			_.ctx.globalAlpha = _.alpha;
		if (_.width)
			_.ctx.lineWidth = _.width;
		if (_.cap !== undef)
			_.ctx.lineCap = (_.cap ? 'round' : 'butt');
		if (_.join !== undef)
			_.ctx.lineJoin = (_.join ? 'round' : 'miter');
			
		if (_.globalAlpha)
			_.ctx.globalAlpha = _.globalAlpha;
		if (_.strokeStyle)
			_.ctx.strokeStyle = _.strokeStyle;
		if (_.fillStyle)
			_.ctx.fillStyle = _.fillStyle;
		if (_.lineWidth)
			_.ctx.lineWidth = _.lineWidth;
		if (_.lineCap)
			_.ctx.lineCap = _.lineCap;
		if (_.lineJoin)
			_.ctx.lineJoin = _.lineJoin;
	},
	
	set_style: function () {
		this.save();
		this._set_style();
	},

	restore_style: function () {
		this.restore();
	},
	
	scope_style: function (func) { var _ = this;
		var res;
		_.set_style();
		res = func();
		_.restore();
		return res;
	},
	
	line: function (beg, end) { var _ = this;
		_.beginPath();
		_.moveTo(beg.x, beg.y);
		_.lineTo(end.x, end.y);
		_.stroke();
	},

	vec_head: function (beg, end) { var _ = this;
		_.save();
		_.translate(end.x, end.y);
		_.rotate(Math.atan2(end.y - beg.y, end.x - beg.x));
		
		_.beginPath();
		_.moveTo(-10, -2);
		_.lineTo(0, 0);
		_.lineTo(-10, 2);
		_.stroke();
		
		_.restore();
	},
	
	vec: function (beg, end) {
		this.line(beg, end);
		this.vec_head(beg, end);
	},
	
	rect: function (beg, size, fill) { var _ = this;
		_.beginPath();
		_.rect(beg.x, beg.y, size.x, size.y);
		_.closePath();
		if (fill)
			_.fill();
		else
			_.stroke();
	},
	
	circle: function (pos, r, fill) { var _ = this;
		_.beginPath();
		_.arc(pos.x, pos.y, r, 0, 2 * PI);
		_.closePath();
		if (fill)
			_.fill();
		else
			_.stroke();
	}
}
