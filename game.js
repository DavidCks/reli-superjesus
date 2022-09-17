function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class collisionZone
{
	constructor(width, height, x, y)
	{
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}
}

class game
{
	constructor()
	{
		//Aliases
		this.ParticleContainer = PIXI.particles.ParticleContainer;
		this.Container = PIXI.Container;
		this.autoDetectRenderer = PIXI.autoDetectRenderer;
		this.loader = PIXI.loader;
		this.resources = PIXI.loader.resources;
		this.Sprite = PIXI.Sprite;
		
		//Settings Bottom
		this.bottomWidth = 112;
		this.bottomHeight = 243;
		this.surface = window.innerHeight - this.bottomHeight;
		
		//Settings Character
		this.charWidth = 114;
		this.charHeight = 127;
		this.StaticSpeed = 4;
		this.JumpHeight = 30;
		
		//Settings Blocks
		this.ammountOfBlocks = 50;
		this.blockSize = 56;
		
		//Settings Homeless
		this.ammountOfHomeless = 5;
		
		//Settings Game
		this.state = this.play;
		this.height = window.innerHeight;
		this.width = window.innerWidth;
		this.collisionOffset = 10;
		
		//Sprite Placeholder
		this.BottomSprite = [];
		this.CharJumpSprite = [];
		this.CharRunningSprite = [];
		this.BlockSprite = [];
		this.HomelessSprite = [];
		this.HomelessActive = [];
		this.HomelessSpaceSprite = [];
		this.HomelessSavedSprite = [];
		this.GoalSprite = [];
		this.HomelessRunningSprite = [];
		
		//Create the renderer
		this.renderer = this.autoDetectRenderer(window.innerWidth, window.innerHeight);
		this.renderer.backgroundColor = 0x599FFF;
		this.loader
			.add("img/Bottom.jpg")
			.add("img/CharJump1.png")
			.add("img/CharJump2.png")
			.add("img/CharRunning1.png")
			.add("img/CharRunning2.png")
			.add("img/CharRunning3.png")
			.add("img/CharRunning4.png")
			.add("img/CharRunning5.png")
			.add("img/CharRunning6.png")
			.add("img/Block.jpg")
			.add("img/Homeless1.png")
			.add("img/Homeless2.png")
			.add("img/HomelessSaved.png")
			.add("img/Goal.png")
			.add("img/HomelessRunning1.png")
			.add("img/HomelessRunning2.png")
			.add("img/HomelessRunning3.png")
			.load(this.setup);
			
		this.stage = new this.Container(); //Create a container object called the `stage`
		
		//System Variables
		this.FrameCount = 0;
		this.Collision = false;
		this.CollisionWithSide = false;
		this.CharSprite = 0;
		this.MoveCounter = 0;
		this.MoveSpeed = 0;
		this.moving = false;
		this.jumping = false;
		this.CharPos = 0;
		this.facingRight = true;
		this.JumpVelocity = this.JumpHeight;
		this.relocatedCharPos = 0;
		this.collisionIndex = 0;
		this.collisionHomelessIndex = -1;
		this.score = 0;
		this.InGoal = false;
		this.HomelessMoveCounter = 0;
		
		//Keyboard
		window.addEventListener("keypress", this.keyDown);
		window.addEventListener("keyup", this.keyUp);
		
		//Keyboard Variables
		this.aDowm = false;
		this.dDowm = false;
		this.wDowm = false;
		this.spaceDowm = false;
	}
	
	collision(r1, r2) {

	  //Define the variables we'll need to calculate
	  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

	  //hit will determine whether there's a collision
	  hit = false;

	  //Find the center points of each sprite
	  r1.centerX = r1.x + r1.width / 2;
	  r1.centerY = r1.y + r1.height / 2;
	  r2.centerX = r2.x + r2.width / 2;
	  r2.centerY = r2.y + r2.height / 2;

	  //Find the half-widths and half-heights of each sprite
	  r1.halfWidth = r1.width / 2;
	  r1.halfHeight = r1.height / 2;
	  r2.halfWidth = r2.width / 2;
	  r2.halfHeight = r2.height / 2;

	  //Calculate the distance vector between the sprites
	  vx = r1.centerX - r2.centerX;
	  vy = r1.centerY - r2.centerY;

	  //Figure out the combined half-widths and half-heights
	  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

	  //Check for a collision on the x axis
	  if (Math.abs(vx) < combinedHalfWidths) {
		//A collision might be occuring. Check for a collision on the y axis
		if (Math.abs(vy) < combinedHalfHeights) {
		  //There's definitely a collision happening
		  hit = true;
		} else {

		  //There's no collision on the y axis
		  hit = false;
		}
	  } else {

		//There's no collision on the x axis
		hit = false;
	  }
	  
	  //`hit` will be either `true` or `false`
	  return hit;
	}
	
	collisionX(r1, r2) {

	  //Define the variables we'll need to calculate
	  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

	  //hit will determine whether there's a collision
	  hit = false;

	  //Find the center points of each sprite
	  r1.centerX = r1.x + r1.width / 2;
	  r1.centerY = r1.y + r1.height / 2;
	  r2.centerX = r2.x + r2.width / 2;
	  r2.centerY = r2.y + r2.height / 2;

	  //Find the half-widths and half-heights of each sprite
	  r1.halfWidth = r1.width / 2;
	  r1.halfHeight = r1.height / 2;
	  r2.halfWidth = r2.width / 2;
	  r2.halfHeight = r2.height / 2;

	  //Calculate the distance vector between the sprites
	  vx = r1.centerX - r2.centerX;
	  vy = r1.centerY - r2.centerY;

	  //Figure out the combined half-widths and half-heights
	  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

	  //Check for a collision on the x axis
	  if (Math.abs(vx) < combinedHalfWidths) {
		//A collision might be occuring. Check for a collision on the y axis
		hit = true
	  } else {

		//There's no collision on the x axis
		hit = false;
	  }
	  
	  //`hit` will be either `true` or `false`
	  return hit;
	}
	
	keyDown(e)
	{
		if(e.keyCode == 100 /*d key*/)
		{
			console.log('keycode: ' + e.keyCode + ', d pressed');
			g.facingRight = true;
			g.dDown = true;
		}
		
		if(e.keyCode == 97 /*a key*/)
		{
			console.log('keycode: ' + e.keyCode + ', a pressed');
			g.facingRight = false;
			g.aDown = true;
		}
		
		if(e.keyCode == 119 /*w key*/)
		{
			console.log('keycode: ' + e.keyCode + ', w pressed');
			g.wDown = true;
		}
		
		if(e.keyCode == 32 /*space key*/)
		{
			console.log('keycode: ' + e.keyCode + ', space pressed');
			g.spaceDown = true;
		}
	}
	
	keyUp(e)
	{
		if(e.keyCode == 68 /*d key*/)
		{
			console.log('keycode: ' + e.keyCode + ', d lifted');
			g.dDown = false;
		}
		
		if(e.keyCode == 65 /*a key*/)
		{
			console.log('keycode: ' + e.keyCode + ', a lifted');
			g.aDown = false;
		}
		
		if(e.keyCode == 87 /*w key*/)
		{
			console.log('keycode: ' + e.keyCode + ', w lifted');
			g.wDown = false;
		}
		
		if(e.keyCode == 32 /*space key*/)
		{
			console.log('keycode: ' + e.keyCode + ', space lifted');
			g.spaceDown = false;
		}
	}
	
	setup()
	{
		//Bottom Sprites
		for(var i = g.bottomWidth * -2; i <= window.innerWidth + g.bottomWidth; i += g.bottomWidth)
		{
			var index = (i + 224) / 112;
			g.BottomSprite[index] = new g.Sprite(g.resources["img/Bottom.jpg"].texture);
			g.BottomSprite[index].x = i;
			g.BottomSprite[index].y = g.surface;
			g.stage.addChild(g.BottomSprite[index]); //Add Bottom Sprites to Stage
		}
		g.width = i - g.bottomWidth;
		
		//Jump Sprite
		for(i = 0; i < 2; i++)
		{
			g.CharJumpSprite[i] = new g.Sprite(g.resources["img/CharJump" + (i + 1) + ".png"].texture);
			g.CharJumpSprite[i].x = window.innerWidth / 3;
			g.CharJumpSprite[i].y = g.surface - g.charHeight;
			g.CharJumpSprite[i].visible = false;
			g.stage.addChild(g.CharJumpSprite[i]); //Add Jump Sprite
		}
		
		//Running Sprite
		for(var i = 0; i < 6; i++)
		{
			g.CharRunningSprite[i] = new g.Sprite(g.resources["img/CharRunning" + (i + 1) + ".png"].texture);
			g.CharRunningSprite[i].x = window.innerWidth / 3;
			g.CharRunningSprite[i].y = g.surface - g.charHeight;
			g.CharRunningSprite[i].visible = false;
			g.CharRunningSprite[i].vx = i + 1;
			g.stage.addChild(g.CharRunningSprite[i]); //Add Running Sprites
		}
		
		//Block Sprite
		for(i = 0; i < g.ammountOfBlocks; i++)
		{
			g.BlockSprite[i] = new g.Sprite(g.resources["img/Block.jpg"].texture);
			g.BlockSprite[i].x = i * g.blockSize;
			g.BlockSprite[i].y = 0;
			g.BlockSprite[i].visible = false;
			g.stage.addChild(g.BlockSprite[i]); //Add Block Sprite to Stage
		}
		
		//Goal Sprite
		g.GoalSprite[0] = new g.Sprite(g.resources["img/Goal.png"].texture);
		g.GoalSprite[0].x = 0;
		g.GoalSprite[0].y = 0;
		g.GoalSprite[0].visible = false;
		g.stage.addChild(g.GoalSprite[0]); //Add Block Sprite to Stage

		//Homeless Sprite
		for(i = 0; i < g.ammountOfHomeless; i++)
		{
			g.HomelessSprite[i] = new g.Sprite(g.resources["img/Homeless1.png"].texture);
			g.HomelessSprite[i].x = i * g.HomelessSprite[i].width;
			g.HomelessSprite[i].y = 0;
			g.HomelessSprite[i].visible = false;
			g.HomelessActive[i] = true;
			g.stage.addChild(g.HomelessSprite[i]); //Add Homeless Sprite to Stage
		}
		
		//Homeless Spacebar Sprite
		for(i = 0; i < g.ammountOfHomeless; i++)
		{
			g.HomelessSpaceSprite[i] = new g.Sprite(g.resources["img/Homeless2.png"].texture);
			g.HomelessSpaceSprite[i].x = i * g.HomelessSpaceSprite[i].width;
			g.HomelessSpaceSprite[i].y = 0;
			g.HomelessSpaceSprite[i].visible = false;
			g.stage.addChild(g.HomelessSpaceSprite[i]); //Add Homeless Spacebar Sprite Sprite to Stage
		}
		
		//Homeless Saved Sprite
		for(i = 0; i < g.ammountOfHomeless; i++)
		{
			g.HomelessSavedSprite[i] = new g.Sprite(g.resources["img/HomelessSaved.png"].texture);
			g.HomelessSavedSprite[i].x = i * g.HomelessSavedSprite[i].width;
			g.HomelessSavedSprite[i].y = 0;
			g.HomelessSavedSprite[i].visible = false;
			g.stage.addChild(g.HomelessSavedSprite[i]); //Add Homeless Saved Sprite to Stage
		}
		
		//Homeless Running Sprite
		for(i = 1; i < 4; i++)
		{
			g.HomelessRunningSprite[i] = new g.Sprite(g.resources["img/HomelessRunning" + i + ".png"].texture);
			g.HomelessRunningSprite[i].x = i * 10;
			g.HomelessRunningSprite[i].y = 0;
			g.HomelessRunningSprite[i].visible = false;
			g.stage.addChild(g.HomelessRunningSprite[i]); //Add Homeless Saved Sprite to Stage
		}
		
		

		g.renderer.view.id = "canvas";
		document.body.appendChild(g.renderer.view); //Add the canvas to the HTML document 
		g.render();
	}
	
	render()
	{	
		//Loop this function 60 times per second
		requestAnimationFrame(g.render);
		
		//Update the current game state:
		g.state();
		
		//Render the stage
		g.renderer.render(g.stage);
	}
	
	play()
	{
		//Test if one of the Bottom Textures is Off-Screen
		for(var i = 0; i < g.BottomSprite.length; i++) 
		{
			if(g.BottomSprite[i].x >= g.width)
				g.BottomSprite[i].x = -g.bottomWidth * 2 + g.BottomSprite[i].x - g.width;	
			if(g.BottomSprite[i].x < -g.bottomWidth * 2)
				g.BottomSprite[i].x = g.width + g.BottomSprite[i].x + g.bottomWidth * 2;
		}
	
		//if the character is moving
		g.moving = g.dDown || g.aDown;
		if(g.moving && !g.CollisionWithSide && !g.InGoal)
		{
			//Count up for every Time the Character moves in the frame to get acceleration
			g.MoveSpeed = g.FrameCount/60;
			if(g.FrameCount <= 60)
				g.FrameCount++;
		
			//Divide Movement Animation into 3 speeds
			if(g.MoveSpeed < 0.3)
			{
				if(g.MoveCounter == 0)
				{
					g.CharSprite++;
					if(g.CharSprite == 3)
						g.CharSprite = 0;
				}
				//move animation on every 6th frame
				g.MoveCounter++;
				if(g.MoveCounter > 5)
					g.MoveCounter = 0;
			} else if(g.MoveSpeed < 0.6)
			{
				if(g.MoveCounter == 0)
				{
					g.CharSprite++;
					if(g.CharSprite == 3)
						g.CharSprite = 0;
				}
				//move animation on every 4th frame
				g.MoveCounter++;
				if(g.MoveCounter > 3) 
					g.MoveCounter = 0;
			} else
			{
				if(g.MoveCounter == 0)
				{
					g.CharSprite++;
					if(g.CharSprite == 3)
						g.CharSprite = 0;
				}
				//move animation on every 2nd frame
				g.MoveCounter++;
				if(g.MoveCounter > 1) 
					g.MoveCounter = 0;
			}
		
			//Moving to the Right      /D/D/D/D/D/D/D
			if(g.dDown)
			{
				//Running Animation Forward
				for(var i = 0; i < g.CharRunningSprite.length; i++)
				{
					if(i == g.CharSprite && !g.wDown)
						g.CharRunningSprite[i].visible = true;
					else
						g.CharRunningSprite[i].visible = false;
				}
				
				//Move Bottom
				if(g.MoveSpeed < 0.3)
				{
					//Bottom
					for(var i = 0; i < g.BottomSprite.length; i++) //move Bottom at 0.3 Speed
					{
						g.BottomSprite[i].x -= g.StaticSpeed;	
					}
					//Blocks
					for(var i = 0; i < g.BlockSprite.length; i++) //move Bottom at 0.3 Speed
					{
						g.BlockSprite[i].x -= g.StaticSpeed;	
					}
					//Homeless
					for(var i = 0; i < g.HomelessSprite.length; i++) //move HomelessSprite at 0.3 Speed
					{
						g.HomelessSprite[i].x -= g.StaticSpeed;	
						g.HomelessSavedSprite[i].x -= g.StaticSpeed;	
					}
					//Goal
					g.GoalSprite[0].x -= g.StaticSpeed;	
					
					g.CharPos += g.StaticSpeed;
				}
				else if(g.MoveSpeed < 0.6)
				{
					//Bottom
					for(var i = 0; i < g.BottomSprite.length; i++) //move Bottom at 0.6 Speed
					{
						g.BottomSprite[i].x -= g.StaticSpeed * 2;	
					}
					//Blocks
					for(var i = 0; i < g.BlockSprite.length; i++) //move Bottom at 0.6 Speed
					{
						g.BlockSprite[i].x -= g.StaticSpeed * 2;	
					}
					//Homeless
					for(var i = 0; i < g.HomelessSprite.length; i++) //move HomelessSprite at 0.6 Speed
					{
						g.HomelessSprite[i].x -= g.StaticSpeed * 2;	
						g.HomelessSavedSprite[i].x -= g.StaticSpeed * 2;	
					}
					//Goal
					g.GoalSprite[0].x -= g.StaticSpeed * 2;	
					
					g.CharPos += 2 * g.StaticSpeed;
				}
				else
				{
					//Bottom
					for(var i = 0; i < g.BottomSprite.length; i++) //move Bottom at full Speed
					{
						g.BottomSprite[i].x -= g.StaticSpeed * 3;	
					}
					//Blocks
					for(var i = 0; i < g.BlockSprite.length; i++) //move Bottom at full Speed
					{
						g.BlockSprite[i].x -= g.StaticSpeed * 3;	
					}
					//Homeless
					for(var i = 0; i < g.HomelessSprite.length; i++) //move HomelessSprite at full Speed
					{
						g.HomelessSprite[i].x -= g.StaticSpeed * 3;	
						g.HomelessSavedSprite[i].x -= g.StaticSpeed * 3;	
					}
					//Goal
					g.GoalSprite[0].x -= g.StaticSpeed * 3;
					
					g.CharPos += 3 * g.StaticSpeed;
				}
			}
			
			//Moving to the Left      /A/A/A/A/A/A/A
			if(g.aDown)
			{
				//Running Animation Backward
				for(var i = 0; i < g.CharRunningSprite.length; i++)
				{
					if(i == g.CharSprite + 3  && !g.wDown)
						g.CharRunningSprite[i].visible = true;
					else
						g.CharRunningSprite[i].visible = false;
				}
				
				//Move Bottom & Blocks 
				if(g.MoveSpeed < 0.3)
				{
					//Bottom
					for(var i = 0; i < g.BottomSprite.length; i++) //move Bottom at 0.3 Speed
					{
						g.BottomSprite[i].x += g.StaticSpeed;	
					}
					//Blocks
					for(var i = 0; i < g.BlockSprite.length; i++) //move Bottom at 0.3 Speed
					{
						g.BlockSprite[i].x += g.StaticSpeed;	
					}
					//Homeless
					for(var i = 0; i < g.HomelessSprite.length; i++) //move HomelessSprite at 0.3 Speed
					{
						g.HomelessSprite[i].x += g.StaticSpeed;
						g.HomelessSavedSprite[i].x += g.StaticSpeed;							
					}
					//Goal
					g.GoalSprite[0].x += g.StaticSpeed;
					
					g.CharPos -= g.StaticSpeed;
				}
				else if(g.MoveSpeed < 0.6)
				{
					//Bottom
					for(var i = 0; i < g.BottomSprite.length; i++) //move Bottom at 0.6 Speed
					{
						g.BottomSprite[i].x += g.StaticSpeed * 2;	
					}
					//Blocks
					for(var i = 0; i < g.BlockSprite.length; i++) //move Bottom at 0.6 Speed
					{
						g.BlockSprite[i].x += g.StaticSpeed * 2;	
					}
					//Homeless
					for(var i = 0; i < g.HomelessSprite.length; i++) //move HomelessSprite at 0.6 Speed
					{
						g.HomelessSprite[i].x += g.StaticSpeed * 2;	
						g.HomelessSavedSprite[i].x += g.StaticSpeed * 2;	
					}
					//Goal
					g.GoalSprite[0].x += g.StaticSpeed * 2;
					
					g.CharPos -= 2 * g.StaticSpeed;
				}
				else
				{
					//Bottom
					for(var i = 0; i < g.BottomSprite.length; i++) //move Bottom at full Speed
					{
						g.BottomSprite[i].x += g.StaticSpeed * 3;	
					}
					//Blocks
					for(var i = 0; i < g.BlockSprite.length; i++) //move Bottom at full Speed
					{
						g.BlockSprite[i].x += g.StaticSpeed * 3;	
					}
					//Homeless
					for(var i = 0; i < g.HomelessSprite.length; i++) //move HomelessSprite at full Speed
					{
						g.HomelessSprite[i].x += g.StaticSpeed * 3;	
						g.HomelessSavedSprite[i].x += g.StaticSpeed * 3;	
					}
					//Goal
					g.GoalSprite[0].x += g.StaticSpeed * 3;	
					
					g.CharPos -= 3 * g.StaticSpeed;
				}
			}
		}
		else
		{
			if(g.facingRight)
			{
				g.CharRunningSprite[0].visible = true;
				for(var i = 1; i < g.CharRunningSprite.length; i++)
					g.CharRunningSprite[i].visible = false;
			}
			else
			{
				g.CharRunningSprite[3].visible = true;
				for(var i = 0; i < 3; i++)
					g.CharRunningSprite[i].visible = false;
				for(var i = 4; i < g.CharRunningSprite.length; i++)
					g.CharRunningSprite[i].visible = false;
			}
			g.MoveSpeed = 0;
			g.FrameCount = 0;
		}
		
		if(g.wDown && !g.InGoal)
		{
			//Trigger Jump
			if(!g.jumping)
				g.jumping = true;
		}
			//Jump
			if(g.jumping)
			{
				//Jump Sprite
				if(!g.facingRight)
				{
					g.CharJumpSprite[1].visible = true;
					g.CharJumpSprite[0].visible = false;
				}
				else
				{
					g.CharJumpSprite[0].visible = true;
					g.CharJumpSprite[1].visible = false;
				}
				
				//hide Running
				for(var i = 0; i < g.CharRunningSprite.length; i++)
				{
					g.CharRunningSprite[i].visible = false;
				}
				
				//Move Jump Sprites
				for(var i = 0; i < 2; i++)
				{
					g.CharJumpSprite[i].y -= g.JumpVelocity;
				}
				g.JumpVelocity -= g.JumpHeight/g.JumpHeight;
				if(g.CharJumpSprite[0].y >= g.surface - g.charHeight)
				{
					//reset height
					g.relocateChar(g.surface - g.charHeight)
					g.jumping = false;
					g.JumpVelocity = g.JumpHeight;
				}
				//Set height for running sprites
				for(var i = 0; i < g.CharRunningSprite.length; i++)
					g.CharRunningSprite[i].y = g.CharJumpSprite[0].y
			}
			else
			{
				g.CharJumpSprite[0].visible = false;
				g.CharJumpSprite[1].visible = false;
			}
		
		if(g.spaceDown)
		{
			if(g.collisionHomelessIndex >= 0) //Has collided with some Homeless
			{
				if(g.HomelessSpaceSprite[g.collisionHomelessIndex].visible)
				{
					//collision with this sprite is active
					var i = g.collisionHomelessIndex;
					g.HomelessActive[i] = false;
					g.HomelessSavedSprite[i].visible = true;
					g.score++;
				}
			}
		}
		/////////
		//LEVEL//
		/////////
		var y1 = g.surface - g.charHeight*3;
		var y2 = g.surface - g.charHeight*4;
		var yH = g.surface - g.HomelessSprite[0].height;
		g.createBlockRow(100, y1, 0, 3);
		g.createBlockRow(500, y2, 3, 2);
		g.createBlockRow(850, y1, 6, 3);
		g.createHomeless(300, yH, 0);
		g.createHomeless(900, yH-380, 1);
		
		g.createBlockRow(1400, y1, 9, 2);
		g.createBlockRow(1700, y2, 11, 4);
		g.createHomeless(1450, yH, 2);
		g.createHomeless(1800, yH - 507, 3);
		g.createGoal(2800, g.surface - g.GoalSprite[0].height, 0);
	}
	
	createGoal(pos, y, index)
	{
		if(g.CharPos > pos && g.CharPos < g.width + g.bottomWidth*2 + pos)
		{
			var i = index;
			g.GoalSprite[i].visible = true;
			if(g.GoalSprite[i].y == 0) //initial positioning
			{
				g.GoalSprite[i].y = y;
				g.GoalSprite[i].x = g.width + g.GoalSprite[i].width;
			}
			var collZone = new collisionZone(g.GoalSprite[index].width,
										g.GoalSprite[index].height,
										g.GoalSprite[index].x + g.CharJumpSprite[0].width,
										g.GoalSprite[index].y
										);
			//check for collision
			if(g.jumping)
				g.Collision = g.collision(collZone, g.CharJumpSprite[0]);
			else
				g.Collision = g.collision(collZone, g.CharRunningSprite[0]);
			if(g.Collision)
			{
				//In Goal
				g.InGoal = true;
				for(var i = 0; i < g.CharRunningSprite.length; i++)
					g.CharRunningSprite[i].visible = false;

				if(g.HomelessRunningSprite[1].x >= g.GoalSprite[0].x)
				{
					g.HomelessRunningSprite[1].y = 0;
					g.HomelessRunningSprite[2].y = 0;
					g.HomelessRunningSprite[3].y = 0;
					
					g.HomelessRunningSprite[1].x = 0;
					g.HomelessRunningSprite[2].x = 0;
					g.HomelessRunningSprite[3].x = 0;
					
					g.HomelessRunningSprite[1].visible = false;
					g.HomelessRunningSprite[2].visible = false;
					g.HomelessRunningSprite[3].visible = false;
						
					g.score--;
				}
				
				if(g.score != 0)
					g.goal();
			}
		}
		else
		{
			g.GoalSprite[index].visible = false;
		}
	}
	
	goal() //finish sequence
	{
		if(g.HomelessRunningSprite[1].x < g.GoalSprite[0].x)
		{
			if(g.HomelessRunningSprite[1].y == 0) //init pos
			{
				g.HomelessRunningSprite[1].y = g.surface - g.HomelessRunningSprite[1].height;
				g.HomelessRunningSprite[2].y = g.surface - g.HomelessRunningSprite[2].height;
				g.HomelessRunningSprite[3].y = g.surface - g.HomelessRunningSprite[3].height;
				
				g.HomelessRunningSprite[1].x = -g.HomelessRunningSprite[1].width;
				g.HomelessRunningSprite[2].x = -g.HomelessRunningSprite[2].width;
				g.HomelessRunningSprite[3].x = -g.HomelessRunningSprite[3].width;
			}	
			
			if(g.HomelessMoveCounter < 6)
			{
				g.HomelessRunningSprite[1].visible = true;
				g.HomelessRunningSprite[2].visible = false;
				g.HomelessRunningSprite[3].visible = false;
			}
			else if(g.HomelessMoveCounter < 12)
			{
				g.HomelessRunningSprite[1].visible = false;
				g.HomelessRunningSprite[2].visible = true;
				g.HomelessRunningSprite[3].visible = false;
			}
			else if(g.HomelessMoveCounter < 18)
			{
				g.HomelessRunningSprite[1].visible = false;
				g.HomelessRunningSprite[2].visible = false;
				g.HomelessRunningSprite[3].visible = true;
			}
			else
			{
				g.HomelessMoveCounter = 0;
			}
			
			for(var i = 1; i  < 4; i++)
				g.HomelessRunningSprite[i].x += 3;
			console.log(g.HomelessRunningSprite[1].x);
			g.HomelessMoveCounter++;
		}
		else
		{
			g.HomelessRunningSprite[1].visible = false;
			g.HomelessRunningSprite[2].visible = false;
			g.HomelessRunningSprite[3].visible = false;
		}
	}
	
	createBlockRow(pos, y, index, length)
	{
		if(g.CharPos > pos && g.CharPos < g.width + g.bottomWidth*2 + pos)
		{
			for(var i = index; i < index + length; i++)
			{
				g.BlockSprite[i].visible = true;
				if(g.BlockSprite[i].y == 0) //initial positioning
				{
					g.BlockSprite[i].y = y;
					g.BlockSprite[i].x = g.width + g.BlockSprite[i].width * (i -index);
				}
			}
			var collZone = new collisionZone(g.BlockSprite[index].width * length,
										g.BlockSprite[index].height,
										g.BlockSprite[index].x,
										g.BlockSprite[index].y
										);
			//check for collision
			if(g.jumping)
				g.Collision = g.collision(collZone, g.CharJumpSprite[0]);
			else
				g.Collision = g.collision(collZone, g.CharRunningSprite[0]);
			if(g.Collision)
			{
				g.collisionIndex = index;
				g.handleCollisionBlock(index);
			}
			else
			{
				if(g.CharRunningSprite[0].y == g.relocatedCharPos && !g.collisionX(collZone, g.CharRunningSprite[0]) && g.collisionIndex == index)
				{
					//Jump Sprite
					if(!g.facingRight)
					{
						g.CharJumpSprite[1].visible = true;
						g.CharJumpSprite[0].visible = false;
					}
					else
					{
						g.CharJumpSprite[0].visible = true;
						g.CharJumpSprite[1].visible = false;
					}
					
					//Trigger Jump
					if(!g.jumping)
					{
						g.jumping = true;
						g.JumpVelocity = 0; //so the Character only falls
					}
				}
			}
		}
		else
		{
			for(var i = index; i < index + length; i++)
			{
				g.BlockSprite[i].visible = false;
			}
		}
	}
	
	createHomeless(pos, y, index)
	{
		if(g.CharPos > pos && g.CharPos < g.width + g.bottomWidth*2 + pos && g.HomelessActive[index])
		{
			var i = index;
			g.HomelessSprite[i].visible = true;
			if(g.HomelessSprite[i].y == 0) //initial positioning
			{
				g.HomelessSprite[i].y = y;
				g.HomelessSprite[i].x = g.width;
				//Homeless Saved Sprite
				g.HomelessSavedSprite[i].y = y;
				g.HomelessSavedSprite[i].x = g.width;
			}

			var collZone = new collisionZone(g.HomelessSprite[index].width,
										g.HomelessSprite[index].height,
										g.HomelessSprite[index].x,
										g.HomelessSprite[index].y
										);
			//check for collision
			if(g.jumping)
				g.Collision = g.collision(collZone, g.CharJumpSprite[0]);
			else
				g.Collision = g.collision(collZone, g.CharRunningSprite[0]);
			if(g.Collision) //Collision Handling
			{
				console.log("Collision with Homeless");
				g.collisionHomelessIndex = index;
				// Homeless press Spacebar Sprite
				g.HomelessSpaceSprite[index].y = y;
				g.HomelessSpaceSprite[index].x = g.HomelessSprite[i].x;
				g.HomelessSpaceSprite[index].visible = true;
				// Turn initial Homeless Sprite Invisible
				g.HomelessSprite[index].visible = false;
			} 
			else
			{
				g.HomelessSpaceSprite[index].visible = false;
			}
		}
		else
		{
			g.HomelessSprite[index].visible = false;
			g.HomelessSpaceSprite[index].visible = false;
		}
	}
	
	handleCollisionBlock(index)
	{
		if(g.jumping)
			var charSprite = g.CharJumpSprite[0];
		else
			var charSprite = g.CharRunningSprite[0];
		console.log(g.BlockSprite[index].y);
		console.log(g.BlockSprite[index].y - g.collisionOffset + "<" + charSprite.y);
		if(g.BlockSprite[index].x /*+ g.blockSize*/ - g.collisionOffset < charSprite.x) //collision from right side
		{
			g.CollisionWithSide = true;
			console.log("collision from right side");
		} else if(g.BlockSprite[index].x + g.collisionOffset > charSprite.x /*+ g.charWidth*/) //collision from left side
		{
			g.CollisionWithSide = true;
			console.log("collision from left side");
		} if(g.BlockSprite[index].y + g.collisionOffset > charSprite.y + g.charHeight && g.CharRunningSprite.y != charSprite.y - g.collisionOffset) //collision from above
		{
			g.relocatedCharPos = g.BlockSprite[index].y - g.BlockSprite[index].height * 2 - g.collisionOffset;
			g.CollisionWithSide = false;
			g.JumpVelocity = g.JumpHeight;
			g.jumping = false;
			console.log("collision from above");
			g.relocateChar(g.relocatedCharPos);
			g.CharJumpSprite[0].visible = false;
			g.CharJumpSprite[1].visible = false;
		} else if(g.BlockSprite[index].y /*+ g.blockSize*/ - g.collisionOffset < charSprite.y) //collision from below
		{
			g.CollisionWithSide = false;
			g.JumpVelocity *= -1; //turn arround jump direction
			console.log("collision from below");
		}
	}
	
	relocateChar(y)
	{
		for(var i = 0; i < g.CharRunningSprite.length; i++)
		{
			g.CharRunningSprite[i].y = y;
		}
		g.CharJumpSprite[0].y = y;
		g.CharJumpSprite[1].y = y;
	}
	
	menu()
	{
		
	}
}

var g = new game();


