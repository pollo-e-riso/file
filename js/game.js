import { createBoundaries, drawBoundaries, boundarySize, boundaryAmountHorizontal } from "./map.js";
import { Pacman, pacmanMovement } from "./pacman.js";

const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const pacmanStartPosition = boundarySize + boundarySize / 2;
const pacman = new Pacman(pacmanStartPosition, pacmanStartPosition, 0, 0);

//god knows why it's 180, but it works
canvas.width = boundaryAmountHorizontal * boundarySize - 180;
canvas.height = innerHeight;

createBoundaries();
pacmanMovement(pacman);
animationLoop();

function animationLoop() {
    requestAnimationFrame(animationLoop);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    pacman.move();
    drawBoundaries(createBoundaries());
}

