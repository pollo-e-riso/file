import { boundarySize } from "./map.js";

const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const pacmanSpeed = 3;

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

function pacmanMovement(pacman) {
    $(document).keydown((event) => {
        let keyPressed = event.key;

        switch (keyPressed) {
            case "w":
            case "W":
            case "ArrowUp":
                pacman.speedX = 0;
                pacman.speedY = -pacmanSpeed;
                break;

            case "s":
            case "S":
            case "ArrowDown":
                pacman.speedX = 0;
                pacman.speedY = pacmanSpeed;
                break;

            case "d":
            case "D":
            case "ArrowRight":
                pacman.speedY = 0;
                pacman.speedX = pacmanSpeed;
                break;

            case "a":
            case "A":
            case "ArrowLeft":
                pacman.speedY = 0;
                pacman.speedX = -pacmanSpeed;
                break;
        }

        console.log("X and Y speed: " + pacman.speedX + " " + pacman.speedY);
    });
}

export { Pacman, pacmanMovement };
