$(document).ready(() => {

    const canvas = document.querySelector("canvas");
    const canvasContext = canvas.getContext("2d");

    const boundarySize = 30;
    const boundaryAmountHorizontal = 27;

    const pacmanSpeed = 3;

    //god knows why it's 180, but it works
    canvas.width = boundaryAmountHorizontal * boundarySize - 180;
    canvas.height = innerHeight;


    //MAP
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

    function createBoundaries(){

        boundaries = [];

        map.forEach((row, rowIndex) => {
            row.forEach((boundary, boundaryIndex) => {
                if(boundary == 1){
                    boundaries.push(new Boundary(boundarySize * boundaryIndex, boundarySize * rowIndex));
                }
            });
        });
        
        drawBoundaries();
    }

    function drawBoundaries(){
        boundaries.forEach((boundary) => {
            boundary.draw();
        });      
    }
    
    
    //PACMAN
    function collisionDetection(){
        boundaries.forEach((boundary) => {
            if(isColliding(boundary)){
                pacman.speedX = 0;
                pacman.speedY = 0;
            }
        });    
    }
    
    function isColliding(boundary){
        return (pacman.y + pacman.radius + pacman.speedY >= boundary.y &&
                pacman.y - pacman.radius + pacman.speedY <= boundary.y + boundary.height &&
                pacman.x + pacman.radius + pacman.speedX >= boundary.x &&
                pacman.x - pacman.radius + pacman.speedX <= boundary.x + boundary.width)
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
    
    function createPacman(){
        let pacmanStartPosition = boundarySize + boundarySize / 2;
        
        pacman = new Pacman(pacmanStartPosition, pacmanStartPosition, 0, 0);
    }
    
    function pacmanMovement(){
        $(document).keydown((event) => {
            let keyPressed = event.key;
            
            switch(keyPressed){
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
    
    
    //GAME
    createBoundaries();
    createPacman()
    pacmanMovement();
    gameLoop();
    
    function gameLoop(){
        requestAnimationFrame(gameLoop);
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        pacman.move();
        collisionDetection();
        drawBoundaries();
    }
});

