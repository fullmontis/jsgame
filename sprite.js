function Sprite( img, x, y, alpha, anchorx, anchory ) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.alpha = alpha || 1;
    this.anchorx = anchorx || images[this.img].width/2;
    this.anchory = anchory || images[this.img].height/2;
    this.collw = images[this.img].width;
    this.collh = images[this.img].height;
    this.solid = true; // says if you can collide with this object

    this.update = function () {

    };

    this.draw = function() {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(images[this.img], 
		      this.x-this.anchorx, this.y-this.anchory);
        ctx.globalAlpha = 1;
    }

    this.collides = function( spr2 ) {
	if (this.x-this.anchorx < spr2.x-spr2.anchorx+spr2.collw &&
            spr2.x-spr2.anchorx < this.x-this.anchorx+this.collw &&
            this.y-this.anchory < spr2.y-spr2.anchory+spr2.collh &&
            spr2.y-spr2.anchory < this.y-this.anchory+this.collh &&
            this.solid && spr2.solid) {
            return true;
	} else {
            return false;
	}
    }

    this.collidesAt = function( x, y ) {
	if (x >= this.x-this.anchorx &&
            x <= this.x-this.anchorx+this.collw &&
            y >= this.y-this.anchory &&
            y <= this.y-this.anchory+this.collh) {
            return true;
	} else {
            return false;
	}
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

