
if (document.readyState == 'loading')
{
   document.addEventListener("DOMContentLoaded", Setup);
}
else
{
    Setup();
}

let CurrentIndex = 0;

let BallElement;// = document.getElementById("Ball");

let DifferenceX;
let DifferenceY;

function Setup()
{
    
    BallElement = document.getElementById("Ball");
    // Add the ondragstart event listener
    BallElement.addEventListener("touchmove", TouchMove);
    BallElement.addEventListener("touchstart", TouchStart);
	
	BallElement.style.left = "10%";
	BallElement.style.top = "30%";
}

function TouchStart(event)
{    
    console.log("start");    
    var touchLocation = event.targetTouches[0];
	var rect = BallElement.getBoundingClientRect();
	BallElement.parentElement.getBoundingClientRect();
	
	BallElement.style.marginTop;
	
	DifferenceX = rect.left - touchLocation.pageX;
	DifferenceY = rect.top - touchLocation.pageY;
	
	CreateDebugBlock(BallElement.style.left + DifferenceX, BallElement.style.top + DifferenceY, "green", document.firstChild);
	// CreateDebugBlock(touchLocation.pageX, touchLocation.pageY, "purple", document.firstChild);
			
    event.preventDefault();
}
function TouchMove(event)
{    
    console.log("drag");   
    var touchLocation = event.targetTouches[0];
	console.log("New touch x: " + touchLocation.pageX + " y: " + touchLocation.pageY);
    
	var rect = BallElement.getBoundingClientRect();	
	
    let NewX = touchLocation.pageX + DifferenceX;
    let NewY = touchLocation.pageY + DifferenceY;
	console.log("New x: " + NewX + " y: " + NewY);
	
    BallElement.style.left = NewX + 'px';
    BallElement.style.top = NewY + 'px';
	const EndX = rect.left + (rect.right - rect.left) / 2;
	const EndY = rect.bottom - (rect.bottom - rect.top) / 2;
	// CreateDebugBlock(rect.left, rect.top, "pink", document.firstChild);
	// CreateDebugBlock(touchLocation.pageX, touchLocation.pageY, "blue", document.firstChild);
	// CreateDebugBlock(EndX, EndY, "blue", document.firstChild);
    
    event.preventDefault(); 
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
