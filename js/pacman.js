$(document).ready(() => {

    //Creazione del tag canvass
    const canvas = document.querySelector("canvas");
    const canvasContext = canvas.getContext("2d");

    //Dimensioni di un quadrato
    const boundarySize = 40;
    
    //La quantita' orizzontale dei quadrati
    const boundaryAmountHorizontal = 27;
    
    //La quantita' verticale dei quadrati
    const boundaryAmountVertical = 30;

    //La velocita' del pacman
    const pacmanSpeed = 5;

    //La posizione iniziale del pacman
    const pacmanStartPosition = boundarySize + boundarySize / 2;

    //Array con confini gia' creati(sara' riempito nel futuro tramite la funzione createBoundaries())
    const boundaries = [];

    //Impostazione della grandezza e altezza del tag canvas
    canvas.width = boundaryAmountHorizontal * boundarySize - 240;
    canvas.height = boundaryAmountVertical * boundarySize - 280;


    //La mappa del gioco
    //Dimensioni totali: 27 * 30
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
    //La classe per definire i confini
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

    //La funzione per creare i confini scorrendo un array
    function createBoundaries(){
        map.forEach((row, rowIndex) => {
            row.forEach((boundary, boundaryIndex) => {
                if(boundary == 1){
                    boundaries.push(new Boundary(boundarySize * boundaryIndex, boundarySize * rowIndex));
                }
            });
        });
        
        drawBoundaries();
    }

    //La funzione per disegnare i confini
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
    
    //La classe per definire il pacman
    class Pacman{
        //costruttore con la posizione x/y, velocita' x/y e il raggio del pacman
        constructor(x, y, speedX, speedY){
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.radius = 18;
        }
        
        //metodo per disegnare un cerchio 
        draw(){            
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
            canvasContext.fillStyle = "yellow";
            canvasContext.fill();
            canvasContext.closePath();
        }
        
        //metodo per spostare pacman
        move(){
            this.draw();
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
    
    //funzione per creare il pacman in certo punto
    function createPacman(){        
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
    //La sezione per utilizzare tutti i metodi e funzione del gioco
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

