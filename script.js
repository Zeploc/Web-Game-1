
const TicksPerSecond = 60;
const DeltaTime = 1 / 60;


class Vector
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	copy(v1)
	{
		this.x = v1.x;
		this.y = v1.y;
	}
	AddVector (v2)
	{
		let v1 = CopyVector(this);
		v1.x += v2.x;
		v1.y += v2.y;
		return v1;
	}
	SubtractVector(v2)
	{
		let v1 = CopyVector(this);
		v1.x -= v2.x;
		v1.y -= v2.y;
		return v1;
	}
	MultipleVector (m)
	{
		let v1 = CopyVector(this);
		v1.x *= m;
		v1.y *= m;
		return v1;
	}
	DivideVector (m)
	{
		let v1 = CopyVector(this);
		v1.x /= m;
		v1.y /= m;
		return v1;
	}
	ZeroVector()
	{
		this.x = 0;
		this.y = 0;
	}
	ToString()
	{
		return "x: " + this.x + " y: " + this.y;
	}
}
function CopyVector(v2)
{
	let v1 = new Vector(0,0);
	v1.copy(v2);
	return v1;
}

class Entity
{
	constructor(size = new Vector(50, 50), color = "rgba(51, 51, 51, 0.158)")
	{
		this.position = new Vector(0,0);
		this.velocity = new Vector(0,0);
		this.size = size;
		this.gravityEnabled = true;
		this.PhysicsEnabled = true;
		this.GroundFriction = .35;
		
		this.Element = document.createElement("div");
		this.Element.style.backgroundColor = color;
		this.Element.style.width = size.x + "px";
		this.Element.style.height = size.y + "px";
		this.Element.style.position = "absolute";
		this.Element.style.left = this.position.x;
		this.Element.style.top = this.position.y;
		this.Element.style.borderRadius = '50%';
		document.firstChild.appendChild(this.Element);
		
		// Add the ondragstart event listener
		this.Element.addEventListener("touchstart", TouchStart);
		this.Element.addEventListener("touchmove", TouchMove);
		this.Element.addEventListener("touchend", TouchEnd);
		
		this.Element.addEventListener("mousedown", MouseStart);
		addEventListener("mousemove", MouseMove);
		addEventListener("mouseup", MouseEnd);
		
		this.mouseDown = false;
		this.previousPositions = [this.position];
	}
	
	Update(DeltaTime)
	{
		if (this.PhysicsEnabled)
			this.position = this.position.AddVector(this.velocity.MultipleVector(DeltaTime));
			
		const windowHeight = document.firstChild.getBoundingClientRect().bottom;
		const windowWidth = document.firstChild.getBoundingClientRect().right;
		if (this.position.y + this.size.y > windowHeight)
		{
			this.position.y = windowHeight - this.size.y;
			this.velocity.y = -this.velocity.y * 0.5;
			this.velocity.x *= 1 - (DeltaTime * this.GroundFriction);
		}
		
		if (this.position.x + this.size.x > windowWidth)
		{
			this.position.x = windowWidth - this.size.x;
			this.velocity.x = -this.velocity.x * 0.5;
		}
		else if (this.position.x < 0)
		{
			this.position.x = 0;
			this.velocity.x = -this.velocity.x * 0.5;
		}
		this.previousPositions.push(this.position);
		const MaxPrevPositions = 26;
		let StartNumber = this.previousPositions.length - MaxPrevPositions - 1;
		StartNumber = Math.max(StartNumber, 0);
		this.previousPositions = this.previousPositions.slice(StartNumber);
		
		this.Element.style.top = this.position.y + "px";
		this.Element.style.left = this.position.x + "px";
	}
}

let Ball;
let Difference = new Vector(0,0);

if (document.readyState == 'loading')
{
   document.addEventListener("DOMContentLoaded", Setup);
}
else
{
    Setup();
}
function Setup()
{	
	Ball = new Entity();	
	const windowHeight = document.firstChild.getBoundingClientRect().bottom;
	
	Ball.position.x = 100;
	Ball.position.y = windowHeight - 300;
	
	setInterval(Tick, DeltaTime, DeltaTime);
}

function Tick(DeltaTime)
{
	const FallSpeed = 50;
	if (Ball)
	{
		if (Ball.gravityEnabled)
			Ball.velocity.y += FallSpeed * DeltaTime;
		Ball.Update(DeltaTime);
	}
}

function TouchStart(event)
{    
    var touchLocation = event.targetTouches[0];
	GrabBall(new Vector(touchLocation.pageX, touchLocation.pageY));
			
    event.preventDefault();
}
function TouchMove(event)
{    
    var touchLocation = event.targetTouches[0];
	MoveBall(new Vector(touchLocation.pageX, touchLocation.pageY));	
    
    event.preventDefault(); 
}
function TouchEnd(event)
{    
	DropBall();
			
    event.preventDefault();
}
function MouseStart(event)
{    
	Ball.mouseDown = true;
	GrabBall(new Vector(event.clientX, event.clientY));
			
    event.preventDefault();
}
function MouseMove(event)
{    	
	if (Ball.mouseDown)
	{
		MoveBall(new Vector(event.clientX, event.clientY));	
	}
    
		event.preventDefault(); 
}
function MouseEnd(event)
{    
	Ball.mouseDown = false;
	DropBall();
			
    event.preventDefault();
}

function GrabBall(position)
{
	Difference.x = Ball.position.x - position.x;
	Difference.y = Ball.position.y - position.y;	
	Ball.gravityEnabled = false;
	Ball.PhysicsEnabled = false;
}
function MoveBall(position)
{
	Ball.position = position.AddVector(Difference)
}
function DropBall()
{
	Ball.gravityEnabled = true;
	Ball.PhysicsEnabled = true;
	let TotalVelocity = new Vector(0,0);
	for (let i = 1; i < Ball.previousPositions.length; i++)
	{
		const VelChange = Ball.previousPositions[i].SubtractVector(Ball.previousPositions[i-1]);
		TotalVelocity = TotalVelocity.AddVector(VelChange.DivideVector(DeltaTime));
	}
	TotalVelocity = TotalVelocity.DivideVector(Ball.previousPositions.length - 1);	
	Ball.velocity = TotalVelocity;
}

function CreateDebugBlock(posX, posY, color, parent)
{
	let NewElement = document.createElement("div");
	NewElement.style.backgroundColor = color;
	NewElement.style.width = "10px";
	NewElement.style.height = "10px";
	NewElement.style.position = "absolute";
	NewElement.style.left = posX;
	NewElement.style.top = posY;
	parent.appendChild(NewElement);
}
