function StateStack( list, current ) {
    this.list = list;
    this.stack = [];
    
    this.push = function (stateid) {
        this.stack.push(stateid);
    }

    this.pop = function () {
        this.stack.pop();
    }

    this.reset = function (stateid) {
        this.stack = [stateid];
    }
    
    this.getCurrent = function () {
	var stateid = this.stack[this.stack.length-1];
        return this.list[stateid];
    }
    
    // get state at position pos in the state stack
    this.getStateByPos = function ( pos ) {
        return this.list[this.stack[pos]];
    };

    // retur state "id" 
    this.getStateById = function ( id ) {
        return this.list[id];
    };

    this.push(current);
}

// primitive prototype State class
function State() {
    this.load = function() {};
    this.update = function() {};
    this.draw = function( context ) {};
    this.unload = function() {};
}

function GameState() {
    this.system = new System();
    
    this.update = function () {
        mouse.update();

	this.system.update();

	keys.clear();
    };
    
    this.draw = function ( context ) {
        context.clear();
	this.system.draw( ctx );
    };
}
GameState.prototype = State.prototype;

function MessageState( message ) {
    this.message = message;
    this.levels = [[3,3],[4,5],[5,7]];
    this.messages = [
	["HELL YEAH!","But it's still simple..."],
	["NICE ONE!","Thing are getting", "interesting"],
	["YOU ROCK!","Thanks for playing"]
    ];

    this.update = function () {
        mouse.update();

	if( mouse.lclick && this.levels.length != 0) {
	    var level = this.levels.shift();
	    this.message = this.messages.shift();
	}
	
	keys.clear();
    };
    
    this.draw = function ( context ) {
	context.fillStyle = "#000";
	context.textAlign = "center";
	context.font = '20pt Monospace';
	for( var i=0; i<this.message.length; i++ ) {
	    context.fillText(this.message[i], SCREEN_W/2, SCREEN_H/2+i*30 );
	}
    };
}
MessageState.prototype = State.prototype;


function IntroState( message ) {
    this.message = message;

    this.update = function () {
        mouse.update();

	if( mouse.lclick ) {
	    states.push(0); 
	}
	
	keys.clear();
    };
    
    this.draw = function ( context ) {
        context.fillStyle = BACKGROUND_FILL;
        context.fillRect(0,0,SCREEN_W,SCREEN_H);

	context.fillStyle = "#f00";
	context.textAlign = "center";
	context.font = '20pt Monospace';
	for( var i=0; i<this.message.length; i++ ) {
	    context.fillText(this.message[i], SCREEN_W/2, SCREEN_H/2+i*30 );
	}
    };
}
IntroState.prototype = State.prototype;

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

    this.draw = function( context ) {
        for ( var i=0; i<this.buttons.length; i++ ) {
            this.buttons[i].draw( context );
        }    
    }
}
MenuState.prototype = State.prototype;

function Button( label, x, y, state ) {
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

    this.draw = function( context ) {
         if ( this.over ) {
            context.fillStyle = "#700";
        } else {
            context.fillStyle = "#a00";
        }
        context.fillRect(this.x-this.anchorx,
		     this.y-this.anchory,this.collw,this.collh);
        context.fillStyle = "#ddd";
        context.fillText(this.label,this.x,this.y);
    };
}

