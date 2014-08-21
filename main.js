var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var SCREEN_W = canvas.width;
var SCREEN_H = canvas.height;
var SPRITE_W = 32;
var SPRITE_H = 32;
var BACKGROUND_FILL = "#a99";
var BORDER_SIZE = 10;

var mouse = { x: 0, y: 0, xold: 0, yold: 0 };
var keys = [],
    keys_pressed = [],
    keys_released = [];

// IMPORTANT: no holes in urls!
// we use images_data.length to check the length!
var images_dir = "img/";
var images_extension = ".png";
var images_data = [
    "ball"
];
var sounds_dir = "snd/";
var sounds_on = false;
var sounds_extension = ".ogg";
var sounds_data = [
];

// here we get an audio extension that works for the current browser
(function() {
    var audio = document.createElement("audio");
    var canplayogg = (typeof audio.canPlayType === "function" && 
                  audio.canPlayType("audio/ogg") !== "");

    if (canplayogg) {
        window.sounds_extension = ".ogg";
    } else {
        //window.sounds_on = false;
        //window.sounds_data = [];
        window.sounds_extension = ".m4a";
    }
})();

var images = [];
var sounds = [];
var sprites = [];
var won = false;
var paused = false;
var collisions_on = true;
var states = new State ([
        new GameState(),
        new PauseState(),
        new MenuState()
    ], 0);

document.addEventListener( 'keydown', function(e) {
    if (keys[e.keyCode]) {
        keys_pressed[e.keyCode] = false;
    } else {
        keys_pressed[e.keyCode] = true;
    }
	keys[e.keyCode] = true;
}, false);

document.addEventListener( 'keyup', function(e) {
    if (!keys[e.keyCode]) {
        keys_released[e.keyCode] = false;
    } else {
        keys_released[e.keyCode] = true;
    }
	keys[e.keyCode] = false;
}, false);

mouse.update = function () {
    if (mouse.l && !mouse.lold) { mouse.lclick = true; } else { mouse.lclick = false; }
    if (mouse.m && !mouse.mold) { mouse.mclick = true; } else { mouse.mclick = false; }
    if (mouse.r && !mouse.rold) { mouse.rclick = true; } else { mouse.rclick = false; }
    
    mouse.lold = mouse.l;
    mouse.mold = mouse.m;
    mouse.rold = mouse.r;
    
    mouse.dx = mouse.x - mouse.xold;
    mouse.dy = mouse.y - mouse.yold;
    
    mouse.xold = mouse.x;
    mouse.yold = mouse.y;
}

document.addEventListener( 'mousemove', function(e){
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}, false);

canvas.addEventListener( 'mousedown', function(e){
    e.preventDefault();
    if (e.which == 1) { mouse.l = true; }
    if (e.which == 2) { mouse.m = true; }
    if (e.which == 3) { mouse.r = true; }
}, false);

canvas.addEventListener( 'mouseup', function(e){
    e.preventDefault();
    if (e.which == 1) { mouse.l = false; }
    if (e.which == 2) { mouse.m = false; }
    if (e.which == 3) { mouse.r = false; }
}, false);

function doCollide( spr1, spr2 ) {
    if (spr1.x-spr1.anchorx < spr2.x-spr2.anchorx+spr2.collw &&
        spr2.x-spr2.anchorx < spr1.x-spr1.anchorx+spr1.collw &&
        spr1.y-spr1.anchory < spr2.y-spr2.anchory+spr2.collh &&
        spr2.y-spr2.anchory < spr1.y-spr1.anchory+spr1.collh &&
        spr1.can_collide && spr2.can_collide) {
        return true;
    } else {
        return false;
    }
}

function collidesAt( spr, x, y ) {
    if (x >= spr.x-spr.anchorx &&
        x <= spr.x-spr.anchorx+spr.collw &&
        y >= spr.y-spr.anchory &&
        y <= spr.y-spr.anchory+spr.collh) {
        return true;
    } else {
        return false;
    }
}

function State(state_list, current) {
    this.state_list = state_list;
    this.state_stack = [];
    
    this.push = function (state_id) {
        this.length = this.state_stack.push(state_id);
    }

    this.pop = function () {
        this.length = this.state_stack.pop();
    }

    this.reset = function (state_id) {
        this.state_stack = [stateid];
    }
    
    this.current = function () {
        return this.state_list[this.state_stack[this.length-1]];
    }
    
    this.getState = function (state_id) {
        return this.state_list[state_id];
    };
    
    this.push(current);
}

function GameState() {
    this.update = function () {
        mouse.update();
        keys_pressed = [];
        keys_released = [];

	for( var name in sprites ) {
	    sprites[name].update();
	}
    };
    
    this.draw = function () {
        ctx.fillStyle = BACKGROUND_FILL;
        ctx.fillRect(0,0,SCREEN_W,SCREEN_H);
	for( var name in sprites ) {
	    sprites[name].draw();
	}
    };
}

function PauseState() {
    this.update = function () {
        mouse.update();
        keys_pressed = [];
        keys_released = [];
    };
    
    this.draw = function () {
        states.getState(0).draw();
    };
}

function MenuState() {
    this.buttons = [
        new Button("START",SCREEN_W/2,200,0),
        new Button("CREDITS",SCREEN_W/2,250,2)
    ];
    
    this.update = function() {
        mouse.update();

        for ( var i=0; i<this.buttons.length; i++ ) {
            this.buttons[i].update();
        }        
    };

    this.draw = function() {
        ctx.fillStyle = BACKGROUND_FILL;
        ctx.fillRect(0,0,SCREEN_W,SCREEN_H);
        for ( var i=0; i<this.buttons.length; i++ ) {
            this.buttons[i].draw();
        }    
        border.draw();
    }
}

function Button(label, x, y, state) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.collw = 100;
    this.collh = 30;
    this.anchorx = this.collw/2;
    this.anchory = this.collh/2;
    this.over = false;
    this.state = state;

    this.update = function() {
        if ( collidesAt( this, mouse.x, mouse.y ) ) {
            this.over = true;
        } else {
            this.over = false;
        }

        if( this.over && mouse.lclick ) {
            states.push(this.state);
        }
    };

    this.draw = function() {
         if ( this.over ) {
            ctx.fillStyle = "#700";
        } else {
            ctx.fillStyle = "#a00";
        }
        ctx.fillRect(this.x-this.anchorx,this.y-this.anchory,this.collw,this.collh);
        ctx.fillStyle = "#ddd";
        ctx.fillText(this.label,this.x,this.y);
    };
}

function Sprite( img, x, y, alpha, anchorx, anchory ) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.alpha = alpha || 1;
    this.anchorx = anchorx || images[this.img].width/2;
    this.anchory = anchory || images[this.img].height/2;
    this.collw = images[this.img].width;
    this.collh = images[this.img].height;
    this.can_collide = true;

    this.update = function () {

    };

    this.draw = function() {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(images[this.img], this.x-this.anchorx, this.y-this.anchory);
        ctx.globalAlpha = 1;
    }
}

function Animation(img_id, anchorx, anchory, w, h, nx, ny, dt_in_frames) {
    this.img = img_id;
    this.w = w;
    this.h = h; 
    this.nx = nx;
    this.ny = ny; 
    this.dt = dt_in_frames;
    this.frames_total = this.nx*this.ny
    this.anchorx = anchorx; 
    this.anchory = anchory;
    
    this.current_framex = 0;
    this.current_framey = 0;
    
    this.elapsed_frames = 0;
    
    if (this.w*this.nx != images[this.img].width || 
	this.h*this.ny != images[this.img].height) {
        throw "Incorrect sprite size or number of frames specified";
    }
    
    this.draw = function(xpos,ypos,scale) {
        if (scale === undefined) scale = 1;
        ctx.drawImage(images[this.img],
		      this.current_framex*this.w,
		      this.current_framey*this.h,
		      this.w,this.h,
                      xpos-this.anchorx,
		      ypos-this.anchory,
		      this.w*scale,
		      this.h*scale);
        this.elapsed_frames++;
        if (this.elapsed_frames>=this.dt) {
            this.current_framex++;
            if (this.current_framex>=this.nx) {
                this.current_framex = 0;
                this.current_framey++;
                if (this.current_framey>=this.ny) {
                    this.current_framex = 0;
                    this.current_framey = 0;
                }
            }    
            this.elapsed_frames = 0;
        }
    }
}

function playSound(id) {
    if (sounds_on) {
        sounds[id].play();
    }
}

function putinside(value,min,max) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
}

function startGame() {
    window.requestAnimationFrame(startGame);
    if( keys_pressed[80] ) { // p: pause
	if( paused ) {
	    states.pop();
	} else {
	    states.push(1);
	}
	paused = !paused;
    }
    states.current().update();
    states.current().draw();
}

function load() {
    // load resources
    var toload = images_data.length + sounds_data.length;
    var loaded = 0;
    var onload = function() {
        loaded++;
	var percent = loaded/toload*100;
        document.getElementById("k").innerHTML = percent.toFixed(1)+" % loaded";
        if ( loaded == toload ) {
            startGame();
	}
    }
    
    for (var i=0;i<images_data.length;i++) {
        images[i] = new Image();
        images[i].onload = onload;
        images[i].src = images_dir + images_data[i] + images_extension;
    }  
    
    for (var i=0;i<sounds_data.length;i++) {
        sounds[i] = new Audio();
        sounds[i].oncanplaythrough = onload;
        sounds[i].src = sounds_dir + sounds_data[i] + sounds_extension;
    }

    // load sprites
    sprites.ball = new Sprite(0, 100, 100);
    sprites.ball.update = function () {
	this.x = mouse.x;
	this.y = mouse.y;
    }
}

load();

