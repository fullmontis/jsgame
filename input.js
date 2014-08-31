window.keys = (function () {
    var keys = {
	down: {},
	pressed: {},
	released: {}
    };

    keys.clear = function(){
	this.pressed = [];
	this.released = [];
    };

    document.addEventListener( 'keydown', (function(e) {
	if (this.down[e.keyCode]) {
            this.pressed[e.keyCode] = false;
	} else {
            this.pressed[e.keyCode] = true;
	}
	this.down[e.keyCode] = true;
    }).bind(keys), false); // bind necessary so that this refers to keys object

    document.addEventListener( 'keyup', (function(e) {
	if (!this.down[e.keyCode]) {
            this.released[e.keyCode] = false;
	} else {
            this.released[e.keyCode] = true;
	}
	this.down[e.keyCode] = false;
    }).bind(keys), false);

    return keys;
})();

window.mouse = (function ( canvas ) {
    var mouse = { 
	x: 0, 
	y: 0,
	l: false,
	m: false,
	r: false,
	lclick: false,
	mclick: false,
	rclick: false,
	canvas: canvas
    };
    var xold = 0;
    var yold = 0;
    var lold = 0;
    var mold = 0;
    var rold = 0;

    mouse.update = function () {
	if (this.l && !lold) { 
	    this.lclick = true; 
	} else { 
	    this.lclick = false; 
	}

	if (this.m && !mold) { 
	    this.mclick = true; 
	} else { 
	    this.mclick = false; 
	}

	if (this.r && !rold) { 
	    this.rclick = true; 
	} else { 
	    this.rclick = false; 
	}

	lold = this.l;
	mold = this.m;
	rold = this.r;
	
	this.dx = this.x - xold;
	this.dy = this.y - yold;
	
	xold = this.x;
	yold = this.y;
    }

    document.addEventListener( 'mousemove', function(e){
	this.x = e.pageX - this.canvas.offsetLeft;
	this.y = e.pageY - this.canvas.offsetTop;
    }.bind(mouse), false);

    canvas.addEventListener( 'mousedown', function(e){
	e.preventDefault();
	if (e.which == 1) { this.l = true; }
	if (e.which == 2) { this.m = true; }
	if (e.which == 3) { this.r = true; }
    }.bind(mouse), false);

    canvas.addEventListener( 'mouseup', function(e){
	e.preventDefault();
	if (e.which == 1) { this.l = false; }
	if (e.which == 2) { this.m = false; }
	if (e.which == 3) { this.r = false; }
    }.bind(mouse), false);

    return mouse;
})( document.getElementById("canvas") );
