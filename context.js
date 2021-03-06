(function () {
    CanvasRenderingContext2D.prototype.BG_COLOR = "#ccc"; 

    CanvasRenderingContext2D.prototype.rect = 
	function( x, y, w, h, color, alpha ) {
	    if( x === undefined ||
		y === undefined ||
		w === undefined ||
		h === undefined ) {
		throw "ERROR: RECT: missing variable";
	    }
	    this.save();
	    this.fillStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.fillRect( x, y, w, h );
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.circle = 
	function( x, y, radius, color, alpha ) {
	    if( x === undefined ||
		y === undefined ||
		radius === undefined ) {
		throw "ERROR: CIRCLE: missing variable";
	    }
	    this.save();
	    this.fillStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.beginPath();
	    this.arc( x, y, radius, 0, 2*Math.PI );
	    this.fill();
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.line = 
	function( x1, y1, x2, y2, color, alpha ) {
	    if( x1 === undefined ||
		y1 === undefined ||
	        x2 === undefined ||
		y2 === undefined ) {
		throw "ERROR: LINE: missing variable";
	    }

	    this.save();
	    this.strokeStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.beginPath();
	    this.moveTo( x1, y1 );
	    this.lineTo( x2, y2 );
	    this.stroke();
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.text = 
	function( text, x, y, color, alpha ) {
	    if( x === undefined ||
		y === undefined ||
		text === undefined ) {
		throw "ERROR: TEXT: missing variable";
	    }

	    this.save();
	    this.fillStyle = color || "#000";
	    if( alpha == 0 ) { 
		this.globalAlpha = 0; 
	    } else {
		this.globalAlpha = alpha || 1; 	
	    };
	    this.fillText( text, x, y );
	    this.restore();
	};

    CanvasRenderingContext2D.prototype.clear = 
	function() {
	    this.rect( 0, 0, 
		       this.canvas.width, this.canvas.height, 
		       this.BG_COLOR );
	};
})();
