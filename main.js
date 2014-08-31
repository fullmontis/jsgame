var canvas = document.getElementById("canvas");
canvas.oncontextmenu = function () {
    return false;
}
var ctx = canvas.getContext("2d");
var game = new Game( ctx );
game.start();
var FPS = 60;
var SCREEN_W = canvas.width;
var SCREEN_H = canvas.height;
var SPRITE_W = 32;
var SPRITE_H = 32;

var states = new StateStack ([
    new GameState(), 
    new MessageState(["GOOD START!","Let's go harder"]),
    new IntroState(["SIGIL"])
], 0);

function Game( context ) {
    var context = context;

    var image = new ImageList( ["ball"], "img/", ".png" );
    var sound = new AudioList( ["step"], "snd/", ".wav" );

    this.start = function() {
	image.load( sound.curryLoad( tick ) );
    };

    function tick() {
	if( mouse.lclick ) {
	    sound[0].currentTime = 0;
	    sound[0].play();
	}
	states.getCurrent().update();
	states.getCurrent().draw( context );
	setTimeout( tick, 1000/FPS );
    }
}

function Ball( x, y, alpha ) {
    this.x = x;
    this.y = y;
    this.alpha = alpha;
    this.radius = 20;

    this.update = function() {
    };

    this.draw = function( context ) {
	context.circle( this.x, this.y, this.radius, "#f00", this.alpha );
    };
}

function System() {
    window.system = this;
    this.balls = [];
    this.angle = 0;
    for( var i=0; i<10; i++ ) {
	this.balls.push(new Ball((i+1)*30, 100, i/10));
    }

    this.update = function() {
	this.angle += 0.02;
    };

    this.draw = function( context ) {
	context.save();
	context.translate(200,200);
	context.rotate(this.angle);
	for( var i=0; i<this.balls.length; i++ ) {
	    this.balls[i].draw( context );
	}
	context.restore();
    };
}
