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
    const pacmanSpeed = 3;

    //La posizione iniziale del pacman
    const pacmanStartPosition = boundarySize + boundarySize / 2;

    //Array con confini gia' creati(sara' riempito nel futuro tramite la funzione createBoundaries())
    const boundaries = [];

    //Impostazione della grandezza e altezza del tag canvas
    canvas.width = boundaryAmountHorizontal * boundarySize - 240;
    canvas.height = boundaryAmountVertical * boundarySize - 270;

    //Un oggetto che contiene tutti le possibili direzioni
    const directions = {
        up: {
            pressed: false
        },
        down: {
            pressed: false
        },
        left: {
            pressed: false
        },
        right: {
            pressed: false
        }
    }

    //Una stringa che contiene la direzione attuale del pacman
    var lastDirection = "";


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
    class Pacman{
        constructor(x, y, speedX, speedY){
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.radius = 18;
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
    
    //La funzione che controlla l'ultima direzione premuta
    function pacmanGetDirection(){
        $(document).keydown((event) => {         
            switch(event.key){
                case "w":
                case "W":
                case "ArrowUp":
                    directions.up.pressed = true;
                    lastDirection = "up";
                    break;
                
                case "s":
                case "S":
                case "ArrowDown":
                    directions.down.pressed = true;
                    lastDirection = "down";
                    break;
                    
                case "d":
                case "D":
                case "ArrowRight":
                    directions.right.pressed = true;
                    lastDirection = "right";
                    break;

                case "a":
                case "A":
                case "ArrowLeft":
                    directions.left.pressed = true;
                    lastDirection = "left";
                    break;
            }
            //console.log(directions.up.pressed);
            //console.log(lastDirection);
        });

        $(document).keyup((event) => {
            switch(event.key){
                case "w":
                case "W":
                case "ArrowUp":
                    directions.up.pressed = false;
                    break;
                
                case "s":
                case "S":
                case "ArrowDown":
                    directions.down.pressed = false;
                    break;
                    
                case "d":
                case "D":
                case "ArrowRight":
                    directions.right.pressed = false;
                    break;

                case "a":
                case "A":
                case "ArrowLeft":
                    directions.left.pressed = false;
                    break;
            }
            //console.log(directions.up.pressed);
        });
    }
    
    //La funzione che cambia la velocità di pacman in base alla direzione premuta, 
    //controllando che tasta sia premuta ultimamente
    //cambia anche il colore della freccia la direzione di cui è attiva
    function pacmanSetSpeed(){
        pacman.speedX = 0;
        pacman.speedY = 0;

        $(".arrow-button").css("background-color", "white");

        if(directions.up.pressed && lastDirection == "up"){
            pacman.speedY = -pacmanSpeed;
            $("#arrow-up").css("background-color", "gray");
        }else if(directions.down.pressed && lastDirection == "down"){
            pacman.speedY = pacmanSpeed;
            $("#arrow-down").css("background-color", "gray");
        }else if(directions.left.pressed && lastDirection == "left"){
            pacman.speedX = -pacmanSpeed;
            $("#arrow-left").css("background-color", "gray");
        }else if(directions.right.pressed && lastDirection == "right"){
            pacman.speedX = pacmanSpeed;
            $("#arrow-right").css("background-color", "gray");
        }
    }

    function collisionDetection(){
        boundaries.forEach((boundary) => {
            if(isColliding(boundary)){
                pacman.speedX = 0;
                pacman.speedY = 0;
                console.log("collision");
            }
        });    
    }
    
    function isColliding(boundary){
        return (pacman.y + pacman.radius + pacman.speedY >= boundary.y &&
                pacman.y - pacman.radius + pacman.speedY <= boundary.y + boundary.height &&
                pacman.x + pacman.radius + pacman.speedX >= boundary.x &&
                pacman.x - pacman.radius + pacman.speedX <= boundary.x + boundary.width)
    }
    
    //GAME
    createBoundaries();
    createPacman()
    gameLoop();
    pacmanGetDirection();
    
    //La funzione che si ripete ogni frame e chiama le altre funzioni
    function gameLoop(){
        requestAnimationFrame(gameLoop);
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        pacmanSetSpeed();
        collisionDetection();
        pacman.move();
        drawBoundaries();
    }
});

