/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [{
	name: "tileset",
	type: "image",
	src: "data/tileset.png"
    }, {
	name: "maze1",
	type: "tmx",
	src: "data/maze1.tmx"
    }, {
        name: "pacman",
        type: "image",
        src: "data/pacman.png"
    }];

var PlayerEntity = me.ObjectEntity.extend({
    
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.gravity = 0;
        this.updateColRect(2, 12, 2, 12);

        this.requestedMovement = null;
        this.requestTimeout = 0.0;

        this.movements = Object.freeze({ 
            Up : { command: 'up', velocity: new me.Vector2d(0,-1) },
            Down : { command: 'down', velocity: new me.Vector2d(0,1) },
            Left : { command: 'left', velocity: new me.Vector2d(-1,0) },
            Right : { command: 'right', velocity: new me.Vector2d(1,0) },
        });
        console.log(this.movements);

    },

    update: function() {

        var newMovementRequest = null;
        
        for(var movementCmd in this.movements) {
            if (me.input.isKeyPressed(this.movements[movementCmd].command)) {
                newMovementRequest = movementCmd;
            }
        }

        if (newMovementRequest == null && this.requestTimeout > 0) {
            console.log(me.timer.tick);
            this.requestTimeout -= me.timer.tick;

            var currentMovement = null;
            
            if (this.vel.x < 0) {
                currentMovement = this.movements.Left;
            } else if (this.vel.x > 0) {
                currentMovement = this.movements.Right;
            } else if (this.vel.y < 0) {
                currentMovement = this.movements.Up;
            } else if (this.vel.y > 0) {
                currentMovement = this.movements.Down;
            }
            
            if (currentMovement != this.movements[this.requestedMovement]) {
                newMovementRequest = this.requestedMovement;
            }
        }

        var pacmanSpeed = 3;
        var prevVel = this.vel.clone();

        if (newMovementRequest != null) {
            this.vel = this.movements[newMovementRequest].velocity.clone();
            this.vel.x *= pacmanSpeed;
            this.vel.y *= pacmanSpeed;
            this.requestedMovement = newMovementRequest;
            this.requestTimeout = 500;
        } 

        var res = this.updateMovement();

        if ((res.x != 0 || res.y != 0) && (prevVel.x != 0 || prevVel.y != 0)) {
            // movement didn't work - hit a wall?
            // restore prevous vel

            this.vel = prevVel;
            this.updateMovement();
        }

        if (this.vel.x != 0 || this.vel.y != 0)
        {
            this.parent(this);
            return true;
        }

        return false;
    },

})

var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 448, 448, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);

            me.debug.renderHitBox = true;
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
	    // set the "Play/Ingame" Screen Object
	    me.state.set(me.state.PLAY, new PlayScreen());
      
            me.entityPool.add("mainPlayer", PlayerEntity);

            me.input.bindKey(me.input.KEY.LEFT, "left");
            me.input.bindKey(me.input.KEY.RIGHT, "right");
            me.input.bindKey(me.input.KEY.UP, "up");
            me.input.bindKey(me.input.KEY.DOWN, "down");
            
            // start the game 
	    me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
	    me.levelDirector.loadLevel("maze1");
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{
	
   }

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
