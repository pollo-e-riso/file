$(document).ready(() => {

    //Creazione del tag canvass
    const canvas = document.querySelector("canvas");
    const canvasContext = canvas.getContext("2d");

    //Dimensioni di un quadrato
    const borderSize = 40;
    
    //La quantita' orizzontale dei quadrati
    const borderAmountHorizontal = 27;
    
    //La quantita' verticale dei quadrati
    const borderAmountVertical = 30;

    //La velocita' del pacman
    const pacmanSpeed = 4;

    //La posizione iniziale del pacman
    const pacmanStartPosition = borderSize + borderSize / 2;

    //Array con confini gia' creati(sara' riempito nel futuro tramite la funzione createBordersArray())
    const borders = [];
    
    //La grandezza dello spazio tra i bordi
    const borderSpaceWidth = borderSize / 1.3;
    const borderOffset = (borderSize - borderSpaceWidth) / 2;

    //Boolean per accendere o spegnere la modalita' debug
    const enableDebug = true;

    //Impostazione della grandezza e altezza del tag canvas
    canvas.width = borderAmountHorizontal * borderSize - 240;
    canvas.height = borderAmountVertical * borderSize - 270;

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
    class Border{
        constructor(x, y, width, height, color){
            this.x = x;
            this.y = y;
            this.width = borderSize;
            this.height = borderSize;
            this.color = color;
        }
    }
//aggiunge hitbox ai bordi
    function createBordersArray(){
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if(map[i][j] == 1){
                    borders.push(new Border(j * borderSize, i * borderSize));   
                }
            }
        }
    }

    function createRectangle(x, y, width, height, color){
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    }

    function drawBorders(){
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 1) {
                    createRectangle(
                        j * borderSize,
                        i * borderSize,
                        borderSize,
                        borderSize,
                        "rgb(40, 33, 204)"
                    );
                    //servono per spostare il bordo e togliere i bordi inutili
                    if (j > 0 && map[i][j - 1] == 1) {
                        createRectangle(
                            j * borderSize,
                            i * borderSize + borderOffset,
                            borderSpaceWidth + borderOffset,
                            borderSpaceWidth,
                            "black"
                        );
                    }
    
                    if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                        createRectangle(
                            j * borderSize + borderOffset,
                            i * borderSize + borderOffset,
                            borderSpaceWidth + borderOffset,
                            borderSpaceWidth,
                            "black"
                        );
                    }
    
                    if (i < map.length - 1 && map[i + 1][j] == 1) {
                        createRectangle(
                            j * borderSize + borderOffset,
                            i * borderSize + borderOffset,
                            borderSpaceWidth,
                            borderSpaceWidth + borderOffset,
                            "black"
                        );
                    }
    
                    if (i > 0 && map[i - 1][j] == 1) {
                        createRectangle(
                            j * borderSize + borderOffset,
                            i * borderSize,
                            borderSpaceWidth,
                            borderSpaceWidth + borderOffset,
                            "black"
                        );
                    }
                }
            }
        }
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
            if(enableDebug){
                console.log("up:" + directions.up.pressed + ", down:" + directions.down.pressed + ", right:" + directions.right.pressed + ", left:" + directions.left.pressed);
                console.log("last direction:" + lastDirection);
                console.log("key pressed:" + event.key)
            }
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
        });
    }
    
    //La funzione che cambia la velocità di pacman in base alla direzione premuta, 
    //controllando che tasta sia premuta ultimamente
    //cambia anche il colore della freccia la direzione di cui è attiva
    function pacmanSetSpeed(){
        $(".arrow-button").css("background-color", "white");

        if(directions.up.pressed && lastDirection == "up"){
            for(let i = 0; i < borders.length; i++){
                const border = borders[i];

                if(isColliding({...pacman, speedX:0, speedY:-pacmanSpeed}, border)){
                    pacman.speedY = 0;
                    
                    if(enableDebug){
                        console.log("future collision");
                    }

                    break;
                } else {
                    pacman.speedY = -pacmanSpeed;
                }
            }
            $("#arrow-up").css("background-color", "gray");
        }else if(directions.down.pressed && lastDirection == "down"){
            for(let i = 0; i < borders.length; i++){
                const border = borders[i];

                if(isColliding({...pacman, speedX:0, speedY:pacmanSpeed}, border)){
                    pacman.speedY = 0;

                    if(enableDebug){
                        console.log("future collision");
                    }

                    break;
                } else {
                    pacman.speedY = pacmanSpeed;
                }
            }
            $("#arrow-down").css("background-color", "gray");
        }else if(directions.left.pressed && lastDirection == "left"){
            for(let i = 0; i < borders.length; i++){
                const border = borders[i];

                if(isColliding({...pacman, speedX:-pacmanSpeed, speedY:0}, border)){
                    pacman.speedX = 0;

                    if(enableDebug){
                        console.log("future collision");
                    }

                    break;
                } else {
                    pacman.speedX = -pacmanSpeed;
                }
            }
            $("#arrow-left").css("background-color", "gray");
        }else if(directions.right.pressed && lastDirection == "right"){
            for(let i = 0; i < borders.length; i++){
                const border = borders[i];

                if(isColliding({...pacman, speedX:pacmanSpeed, speedY:0}, border)){
                    pacman.speedX = 0;

                    if(enableDebug){
                        console.log("future collision");
                    }

                    break;
                } else {
                    pacman.speedX = pacmanSpeed;
                }
            }
            $("#arrow-right").css("background-color", "gray");
        }

        collisionDetection(); 
    }

    function collisionDetection(){
        borders.forEach((border) => {
            if(isColliding(pacman, border)){
                pacman.speedX = 0;
                pacman.speedY = 0;

                if(enableDebug){
                    console.log("collision");
                }
            }
        });    
    }
    
    function isColliding(entity, border){
        return (entity.y + entity.radius + entity.speedY >= border.y &&
                entity.y - entity.radius + entity.speedY <= border.y + border.height &&
                entity.x + entity.radius + entity.speedX >= border.x &&
                entity.x - entity.radius + entity.speedX <= border.x + border.width)
    }
    
    //GAME
    drawBorders();
    createBordersArray();
    createPacman();
    gameLoop();
    pacmanGetDirection();
    
    //La funzione che si ripete ogni frame e chiama le altre funzioni
    function gameLoop(){
        requestAnimationFrame(gameLoop);
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        pacmanSetSpeed();
        pacman.move();
        drawBorders();
    }
});

