import { boundarySize } from "./map.js";

const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const pacmanSpeed = 2;

class Pacman {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.radius = 13;
    }

    draw() {
        let pacmanStartPosition = boundarySize + boundarySize / 2;

        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = "yellow";
        canvasContext.fill();
        canvasContext.closePath();
    }

    move() {
        this.draw();
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function pacmanMovement(pacman, boundaries) {
    $(document).keydown((event) => {
        let keyPressed = event.key;

        switch (keyPressed) {
            case "w":
            case "W":
            case "ArrowUp":
                for(let i=0; i<boundaries.length; i++){
                    if(isColliding(pacman, boundaries[i])){
                        pacman.speedY = 0;
                        break;
                    } else {
                        pacman.speedY = -pacmanSpeed;   
                    }
                }
                break;

            case "s":
            case "S":
            case "ArrowDown":
                for(let i=0; i<boundaries.length; i++){
                    if(isColliding(pacman, boundaries[i])){
                        pacman.speedY = 0;
                        break;
                    } else {
                        pacman.speedY = pacmanSpeed;   
                    }
                }
                break;

            case "d":
            case "D":
            case "ArrowRight":
                for(let i=0; i<boundaries.length; i++){
                    if(isColliding(pacman, boundaries[i])){
                        pacman.speedX = 0;
                        break;
                    } else {
                        pacman.speedX = pacmanSpeed;   
                    }
                }
                break;

            case "a":
            case "A":
            case "ArrowLeft":
                for(let i=0; i<boundaries.length; i++){
                    if(isColliding(pacman, boundaries[i])){
                        pacman.speedX = 0;
                        break;
                    } else {
                        pacman.speedX = -pacmanSpeed;   
                    }
                }
                break;
        }


        //console.log("X and Y speed: " + pacman.speedX + " " + pacman.speedY);
    });
}

function collisionDetection(pacman, boundaries){
    boundaries.forEach((boundary) => {
        if(isColliding(pacman, boundary)){
            pacman.speedX = 0;
            pacman.speedY = 0;
        }
    });    
}

function isColliding(pacman, boundary){
    return (pacman.y + pacman.radius + pacman.speedY >= boundary.y &&
            pacman.y - pacman.radius + pacman.speedY <= boundary.y + boundary.height &&
            pacman.x + pacman.radius + pacman.speedX >= boundary.x &&
            pacman.x - pacman.radius + pacman.speedX <= boundary.x + boundary.width)
}

export { Pacman, pacmanMovement, collisionDetection };
