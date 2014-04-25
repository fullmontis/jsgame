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
// we use imgaes_data.length to check the length!
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

// here we get an extension that works for the current browser
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

var images = [],
    sounds = [],
    won = false,
    collisions_on = true,
    states = new State ([
        new GameState(),
        new PauseState(),
        new MenuState()
    ], 0);

function State(state_list, current) {
    this.state_list = state_list;
    this.state_stack = [];
    this.lenght = 0;
    
    this.push = function (state_id) {
        this.length = this.state_stack.push(state_id);
    }

    this.pop = function () {
        this.length = this.state_stack.pop();
    }

    this.reset = function (state_id) {
        this.state_stack = [stateid];
        this.length = 1;
    }
    
    this.current = function () {
        return this.state_list[this.state_stack[this.length-1]];
    }
    
    this.getState = function (state_id) {
        return this.state_list[state_id];
    };
    
    this.push(current);
}

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
},false);

mouse.update = function () {
    if (mouse.l && !mouse.lold) { mouse.lclick = true; } else { mouse.lclick = false; }
    if (mouse.m && !mouse.mold) { mouse.mclick = true; } else { mouse.mclick = false; }
    if (mouse.r && !mouse.rold) { mouse.rclick = true; } else { mouse.rclick = false; }
    
    mouse.lold = mouse.l;
    mouse.mold = mouse.m;
    mouse.rold = mouse.r;
    
    mouse.dx = mouse.x-mouse.xold;
    mouse.dy = mouse.y-mouse.yold;
    
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

function load_resources() {
    var toLoad = images_data.length + sounds_data.length;

    var onload = function() {
            toLoad--;
            document.getElementById("k").innerHTML = toLoad;
            if (toLoad == 0) {
                load();
                document.getElementById("k").innerHTML = "Done!";
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
    

}

function load() {
    // sprite loading
    window.ball = new Sprite();
    // start main loop
    main();
}

function collide(spr1, spr2) {
    if (spr1.x-spr1.anchorx < spr2.x-spr2.anchorx+spr2.collx &&
        spr2.x-spr2.anchorx < spr1.x-spr1.anchorx+spr1.collx &&
        spr1.y-spr1.anchory < spr2.y-spr2.anchory+spr2.colly &&
        spr2.y-spr2.anchory < spr1.y-spr1.anchory+spr1.colly &&
        spr1.can_collide && spr2.can_collide) {
        return true;
    } else {
        return false;
    }
}

// To implements
function collides_at(spr,x,y) {
    if (x >= spr.x-spr.anchorx &&
        x <= spr.x-spr.anchorx+spr.collx &&
        y >= spr.y-spr.anchory &&
        y <= spr.y-spr.anchory+spr.colly) {
        return true;
    } else {
        return false;
    }
}

function win() {

}

function GameState() {
    this.update = function () {
        mouse.update();

        keys_pressed = [];
        keys_released = [];
    };
    
    this.draw = function () {
        ctx.fillStyle = BACKGROUND_FILL;
        ctx.fillRect(0,0,SCREEN_W,SCREEN_H);
        
        ball.draw();
    };
}

function PauseState() {
    this.update = function () {
        mouse.update();

        keys_pressed = [];
        keys_released = [];
    };
    
    this.draw = function () {
        /*
        ctx.fillStyle = "#aaa";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for (var i=0;i<ENEMIES_MAX;i++) {
            var sprite = enemies[i];
            ctx.save();
            ctx.translate(sprite.x,sprite.y);
            ctx.rotate(sprite.angle);
            ctx.drawImage(images[sprite.img], -sprite.anchorx, -sprite.anchory);
            ctx.restore();
        }
        for (var i=0;i<BULLETS_MAX;i++) {
            var sprite = bullets[i];
            ctx.drawImage(images[sprite.img], sprite.x-sprite.anchorx, sprite.y-sprite.anchory);
        }
        powerup.draw();
        hero.draw();
        */
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
    this.collx = 100;
    this.colly = 30;
    this.anchorx = this.collx/2;
    this.anchory = this.colly/2;
    this.over = false;
    this.state = state;

    this.update = function() {
        if ( collides_at( this, mouse.x, mouse.y ) ) {
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
        ctx.fillRect(this.x-this.anchorx,this.y-this.anchory,this.collx,this.colly);
        ctx.fillStyle = "#ddd";
        ctx.fillText(this.label,this.x,this.y);
    };
}

function Sprite() {
    this.img = 0;
    this.x = SCREEN_W/2;
    this.y = SCREEN_H/2;
    this.anchorx = images[this.img].width/2;
    this.anchory = images[this.img].height/2;
    this.collx = images[this.img].width;
    this.colly = images[this.img].height;
    this.can_collide = true;
    this.alpha = 1;

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
    
    if (this.w*this.nx != images[this.img].width || this.h*this.ny != images[this.img].height) {
        throw "Incorrect sprite size or number of frames specified";
    }
    
    this.draw = function(xpos,ypos,scale) {
        if (scale === undefined) scale = 1;
        ctx.drawImage(images[this.img],this.current_framex*this.w,this.current_framey*this.h,this.w,this.h,
                      xpos-this.anchorx,ypos-this.anchory,this.w*scale,this.h*scale);
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

function play_sound(id) {
    if (sounds_on) {
        sounds[id].play();
    }
}

function putinside(value,min,max) {
    if (value > max) return max;
    if (value < min) return min;
    return value;
}

function toggle(bool) {
    if (bool) return false;
    return true;
}

function main() {
    window.requestAnimationFrame(main);
    states.current().update();
    states.current().draw();
}

load_resources();

