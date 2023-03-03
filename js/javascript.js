var pacman = document.getElementById("pacman");
var playingField = document.getElementById("playingField");

var arrowDown = document.getElementById("arrow-down");
var arrowUp = document.getElementById("arrow-up");
var arrowLeft = document.getElementById("arrow-left");
var arrowRight = document.getElementById("arrow-right");


arrowDown.onclick = pacmanMovement;
arrowUp.onclick = pacmanMovement;
arrowLeft.onclick = pacmanMovement;
arrowRight.onclick = pacmanMovement;

document.onkeydown = pacmanMovement;

function pacmanMovement(event) {
  var targetId = event.target.id;
  var eventKey = event.key;

  var yPos = pacman.offsetTop;
  var xPos = pacman.offsetLeft;

  switch(targetId || eventKey) {
    case "ArrowDown":
    case "arrow-down":
      yPos += 10;
      pacman.style.top = yPos + "px";
      pacman.style.transform = "rotate(-90deg)";
      break;
    case "ArrowUp":
    case "arrow-up":
      yPos -= 10;
      pacman.style.top = yPos + "px";
      pacman.style.transform = "rotate(90deg)";
      break;
    case "ArrowLeft":
    case "arrow-left":
      xPos -= 10;
      pacman.style.left = xPos + "px";
      pacman.style.transform = "rotate(0deg)";
      break;
    case "ArrowRight":
    case "arrow-right":
      xPos += 10;
      pacman.style.left = xPos + "px";
      pacman.style.transform = "rotate(180deg)";
      break;
  }
  consoleLog(event);
  collisionDetection(xPos, yPos);
}

function collisionDetection(x, y) {
  var yBound = playingField.offsetHeight - 8 - 4 - 40;  //minus border, value to make pacman fit and pacman size
  var xBound = playingField.offsetWidth - 8 - 40;       //minus border and pacman size    

  if(x < 0) {
    pacman.style.left = 0;
  }
  else if(x > xBound) {
    pacman.style.left = xBound + "px";
  }

  if(y < 0) {
    pacman.style.top = 0;
  }
  else if(y > yBound ) {
    pacman.style.top = yBound + "px";
  }
}

function consoleLog(event) {
  console.log(event);
  console.log("top: " + pacman.offsetTop);
  console.log("left: " + pacman.offsetLeft);
  //console.log("window height: " + window.innerHeight);
  //console.log("window width: " + window.innerWidth);
}