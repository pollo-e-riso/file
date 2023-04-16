import { createBoundaries, drawBoundaries, boundarySize, boundaryAmountHorizontal } from "./map.js";
import { Pacman, pacmanMovement, collisionDetection } from "./pacman.js";

const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

const pacmanStartPosition = boundarySize + boundarySize / 2;
const pacman = new Pacman(pacmanStartPosition, pacmanStartPosition, 0, 0);

const boundariesArray = createBoundaries();

//god knows why it's 180, but it works
canvas.width = boundaryAmountHorizontal * boundarySize - 180;
canvas.height = innerHeight;

pacmanMovement(pacman, boundariesArray);
gameLoop();

function gameLoop() {
    requestAnimationFrame(gameLoop);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    pacman.move();
    drawBoundaries(boundariesArray);
    collisionDetection(pacman, boundariesArray);
}