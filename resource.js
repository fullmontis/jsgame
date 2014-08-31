// IMPORTANT: no holes in file lists!
// we use images_data.length to check the length!

function ImageList( files, dir, extension ) {
    if( !files.length ) {
	throw "ERROR: no file to load";
    }

    this.dir = dir;
    this.files = files;
    this.extension = extension;
    
    this.load = function( callback ) {
	var toload = this.files.length;
	var loaded = 0;
	var onload = function() {
            loaded++;
	    var percent = loaded/toload*100;
            console.log( percent.toFixed(1)+" % loaded" );
            if ( loaded == toload ) {
		callback();
	    }
	};
	
	for (var i=0;i<toload;i++) {
	    this[i] = new Image();
	    this[i].onload = onload;
	    this[i].src = this.dir + this.files[i] + this.extension;
	}
    }
    
    this.curryLoad = function( callback ) {
	return function() {
	    this.load( callback );
	}.bind(this);
    };
}

function AudioList( files, dir, extension ) {
    if( !files.length ) {
	throw "ERROR: no file to load";
    }

    this.on = true;
    this.dir = dir;
    this.files = files;
    this.extension = extension;
    
    this.load = function( callback ) {
	var toload = this.files.length;
	var loaded = 0;
	var onload = function() {
            loaded++;
	    var percent = loaded/toload*100;
            console.log( percent.toFixed(1)+" % loaded" );
            if ( loaded == toload ) {
		callback();
	    }
	};
	
	for (var i=0;i<toload;i++) {
	    this[i] = new Audio();
	    this[i].oncanplaythrough = onload;
	    this[i].src = this.dir + this.files[i] + this.extension;
	}
    }

        this.curryLoad = function( callback ) {
	return function() {
	    this.load( callback );
	}.bind(this);
    };
}

// here we get an audio extension that works for the current browser
// either ogg for most browsers or aac for ie

function getAudioExtension() {
    var audio = document.createElement("audio");
    var canplayogg = (typeof audio.canPlayType === "function" && 
		      audio.canPlayType("audio/ogg") !== "");

    if (canplayogg) {
        return ".ogg";
    } else {
        return ".m4a";
    }
}


