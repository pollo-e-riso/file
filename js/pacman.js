$(document).ready(() => {
    const canvas = document.querySelector("canvas");
    const canvasContext = canvas.getContext("2d");

    const boundarySize = 30;
    const boundaryAmountHorizontal = 27;
    
    //god knows why it's 180, but it works
    canvas.width = boundaryAmountHorizontal * boundarySize - 180;
    canvas.height = innerHeight;

    class Boundary{
        constructor(x, y){
            this.x = x;
            this.y = y;
            this.width = boundarySize;
            this.height = boundarySize;
        }

        draw(){
            canvasContext.fillStyle = "rgb(27, 55, 212)";
            canvasContext.fillRect(this.x, this.y, this.width, this.height);  
        }
    }

    class Pacman{
        constructor(x, y, speedX, speedY){
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.radius = 13;
        }

        draw(){
            let pacmanStartPosition = boundarySize + boundarySize/2;

            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
            canvasContext.fillStyle = "yellow";
            canvasContext.fill();
            canvasContext.closePath();
        }

        move(){
            this.draw();
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    //27 * 30
    const map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    createBoundaries();
    createPacman();
    pacmanMovement();

    function createPacman(){
        let pacmanStartPosition = boundarySize + boundarySize / 2;

        pacman = new Pacman(pacmanStartPosition, pacmanStartPosition, 0, 0);

        pacman.draw();
    }

    function pacmanMovement(){
        $(document).keydown((event) => {
            let keyPressed = event.key;
            const pacmanSpeed = 5;
            
            switch(keyPressed){
                case "w":
                case "W":
                case "ArrowUp":
                    pacman.speedY = -pacmanSpeed;
                    break;
                
                case "s":
                case "S":
                case "ArrowDown":
                    pacman.speedY = pacmanSpeed;
                    break;
                    
                case "d":
                case "D":
                case "ArrowRight":
                    pacman.speedX = -pacmanSpeed;
                    break;

                case "a":
                case "A":
                case "ArrowLeft":
                    pacman.speedX = pacmanSpeed;
                    break;
            }

            console.log("X speed: " + pacman.speedX);
            console.log("Y speed: " + pacman.speedY);
            
        });
    }

    function createBoundaries(){

        const boundaries = [];

        map.forEach((row, rowIndex) => {
            row.forEach((boundary, boundaryIndex) => {
                if(boundary == 1){
                    boundaries.push(new Boundary(boundarySize * boundaryIndex, boundarySize * rowIndex));
                }
            });
        });
    
        boundaries.forEach((boundary) => {
            boundary.draw();
        });  
    }
});
