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
    },

    update: function() {
        var nextOrientation = 0;
        var pacmanSpeed = 3;

        if (me.input.isKeyPressed('left')) {
            this.vel.x = -pacmanSpeed;
            nextOrientation = 1;
        } else if (me.input.isKeyPressed('right')) {
            this.vel.x = pacmanSpeed;
            nextOrientation = 1;
        } else if (me.input.isKeyPressed('up')) {
            this.vel.y = -pacmanSpeed;
            nextOrientation = 2;
        } else if (me.input.isKeyPressed('down')) {
            this.vel.y = pacmanSpeed;
            nextOrientation = 2;
        }

        if (nextOrientation == 2) {
            this.vel.x = 0;
        } else if (nextOrientation == 1) {
            this.vel.y = 0;
        }

        this.updateMovement();

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
