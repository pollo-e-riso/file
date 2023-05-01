$(document).ready(() => {

    //Selezione del tag canvass
    const canvas = document.querySelector("canvas");

    //Creazione del contesto 2d
    const canvasContext = canvas.getContext("2d");

    //Dimensioni di un confine(e' un quadrato quindi serve solo un valore per la larghezza e l'altezza)
    const borderSize = 40;
    
    //La quantita' orizzontale dei quadrati
    const borderAmountHorizontal = 27;
    
    //La quantita' verticale dei quadrati
    const borderAmountVertical = 30;

    //La velocita' del pacman
    const pacmanSpeed = 3;

    //Il raggio del pacman
    const pacmanRadius = 18;

    //La posizione iniziale del pacman
    const pacmanStartPosition = borderSize + borderSize / 2;

    //Array con confini gia' creati(sara' riempito nel futuro tramite la funzione createBordersArray())
    const borders = [];

    //Array con le palline
    const pellets = [];

    //Array con i fantasmi
    const ghosts = [];
    
    //La grandezza dello spazio tra i bordi
    const borderSpaceWidth = borderSize / 1.3;  //secondo valore deve essere piu' di 1
    const borderOffset = (borderSize - borderSpaceWidth) / 2;

    //Boolean per accendere o spegnere la modalita' debug
    const enableDebug = false;

    //Impostazione della grandezza e altezza del tag canvas
    canvas.width = borderAmountHorizontal * borderSize - 240;
    canvas.height = borderAmountVertical * borderSize - 270;

    //Punteggio del giocatore
    let score = 0;

    //Visualizzazione del punteggio corrente e del punteggio massimo all'inizio del gioco
    $("#score").text(score);

    if(sessionStorage.getItem("highScore") == null) {
        sessionStorage.setItem("highScore", 0);
    }

    $("#highScore").text(sessionStorage.getItem("highScore"));

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
    //0 = spazio vuoto
    //1 = confine
    const map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 0, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 3, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
        [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
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
                    borders.push(new Border(j * borderSize, i * borderSize));   //aggiunge un nuovo confine all'array con coordinate x e y
                }
            }
        }
    }

    //La funzione per disegnare i rettagoli
    function createRectangle(x, y, width, height, color){
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    }

    function drawBorders(){
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                //se il valore è 1 disegna il rettangolo
                if (map[i][j] == 1) {
                    createRectangle(
                        j * borderSize,     //x
                        i * borderSize,     //y
                        borderSize,         //width
                        borderSize,         //height
                        "rgb(40, 33, 204)"  //color
                    );
                    //se c'è un confine sotto disegna un rettangolo nero e lo sposta così da rimuovere il lato tra due confini
                    if (j > 0 && map[i][j - 1] == 1) {
                        createRectangle(
                            j * borderSize,
                            i * borderSize + borderOffset,  
                            borderSpaceWidth + borderOffset,
                            borderSpaceWidth,
                            "black"
                        );
                    }
    
                    //se c'è un confine sopra disegna un rettangolo nero e lo sposta così da rimuovere il lato tra due confini
                    if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                        createRectangle(
                            j * borderSize + borderOffset,
                            i * borderSize + borderOffset,
                            borderSpaceWidth + borderOffset,
                            borderSpaceWidth,
                            "black"
                        );
                    }
    
                    //se c'è un confine a destra disegna un rettangolo nero e lo sposta così da rimuovere il lato tra due confini
                    if (i < map.length - 1 && map[i + 1][j] == 1) {
                        createRectangle(
                            j * borderSize + borderOffset,
                            i * borderSize + borderOffset,
                            borderSpaceWidth,
                            borderSpaceWidth + borderOffset,
                            "black"
                        );
                    }
    
                    //se c'è un confine a sinistra disegna un rettangolo nero e lo sposta così da rimuovere il lato tra due confini
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
            this.radius = pacmanRadius;
        }
        
        //il metodo per disegnare un cerchio
        draw(){            
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
            canvasContext.fillStyle = "yellow";
            canvasContext.fill();
            canvasContext.closePath();
        }
        
        //il metodo per aggiornare la posizione del pacman
        move(){
            this.draw();
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
    
    //La funzione che crea il pacman in posizione specificata
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

        //se un tasto viene rilasciato, l'ultima direzione viene impostata a false
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
    //cambia anche il colore della freccia, la direzione di cui è attiva
    function pacmanSetSpeed(){
        $(".arrow-button").css("background-color", "white");

        if(directions.up.pressed && lastDirection == "up"){
            for(let i = 0; i < borders.length; i++){
                const border = borders[i];

                //passa un pacman con la velocità impostata a quella che avrebbe se premessimo il tasto
                if(isColliding({...pacman, speedX:0, speedY:-pacmanSpeed}, border)){
                    //se ci sarà una collisione, la velocità di pacman viene impostata a 0
                    pacman.speedY = 0;
                    
                    if(enableDebug){
                        console.log("future border collision");
                    }

                    break;
                } else {
                    //se non ci sarà una collisione, la velocità di pacman viene impostata a quella che avrebbe se premessimo il tasto
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
                        console.log("future border collision");
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
                        console.log("future border collision");
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
                        console.log("future border collision");
                    }

                    break;
                } else {
                    pacman.speedX = pacmanSpeed;
                }
            }
            $("#arrow-right").css("background-color", "gray");
        }

        //chiamata della funzione che controlla le collisioni
        collisionDetection(); 
    }

    //La funzione che controlla le collisioni scorrendo l'array con gli hitbox dei bordi
    function collisionDetection(){
        borders.forEach((border) => {
            //se pacman collide con qualsiasi bordo, la sua velocità viene impostata a 0
            if(isColliding(pacman, border)){
                pacman.speedX = 0;
                pacman.speedY = 0;

                if(enableDebug){
                    console.log("border collision");
                }
            }
        });    
    }
    
    //La funzione che prenda la posizione x/y del centro di pacman, aggiunge il suo raggio 
    //e la velocità in direzione appropriato e poi controlla se valore ottenuto è maggiore/minore
    //di quello del bordo 
    function isColliding(entity, border){
        return (entity.y + entity.radius + entity.speedY >= border.y &&                 //down
                entity.y - entity.radius + entity.speedY <= border.y + border.height && //up
                entity.x + entity.radius + entity.speedX >= border.x &&                 //right
                entity.x - entity.radius + entity.speedX <= border.x + border.width)    //left
    }
    //PELLET
    class Pellet{
        constructor(x, y){
            this.x = x;
            this.y = y;
            this.radius = pacmanRadius / 3.8;
        }
        
        //il metodo per disegnare un cerchio
        draw(){            
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
            canvasContext.fillStyle = "orange";
            canvasContext.fill();
            canvasContext.closePath();
        }
    }

    //La funzione che crea un array con le palline
    //Una funzione separata perché deve essere chiamata solo una volta
    function createPelletsArray(){
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if(map[i][j] == 2){
                    pellets.push(new Pellet( j * borderSize + borderSize / 2, i * borderSize + borderSize / 2));
                }
            }
        }
    }

    //La funzione che disegna le palline
    function drawPellets(){
        pellets.forEach((pellet) => {
            pellet.draw();
        });
    }

    //La funzione che controlla se pacman collide con una pallina
    //Se sì, la pallina viene rimossa dall'array
    function pelletsCollision(){
        for(let i = pellets.length - 1; i >= 0; i--){ //scorre l'array al contrario per evitare problemi con processo di disegnamento delle palline
            const pellet = pellets[i];
            //se la distanza tra il centro di pacman e il centro della pallina è minore della somma dei loro raggi
            if(Math.hypot(pellet.x - pacman.x, pellet.y - pacman.y) < pacman.radius + pellet.radius){
                if(enableDebug){
                    console.log("pellet collision");
                }

                pellets.splice(i, 1);//cancella la pallina corrente dall'array
                score += 10;
                if(score > sessionStorage.getItem("highScore")){
                    sessionStorage.setItem("highScore", score);
                    $("#highScore").text(sessionStorage.getItem("highScore"));
                }
                $("#score").text(score);
            }
        }
    }
        //GHOSTS
        class Ghost{
            constructor(x, y, speedX, speedY, color){
                this.x = x;
                this.y = y;
                this.speedX = speedX;
                this.speedY = speedY;
                this.radius = pacmanRadius;
                this.color = color;
            }
            
            //il metodo per disegnare un cerchio
            draw(){            
                canvasContext.beginPath();
                canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
                canvasContext.fillStyle = this.color;
                canvasContext.fill();
                canvasContext.closePath();
            }
            
            //il metodo per aggiornare la posizione del pacman
            move(){
                this.draw();
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }

    function createGhostsArray(){
    for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if(map[i][j] == 3){
                    ghosts.push(new Ghost( j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, 0,"red"));
                }
            }
        }
    }

    function drawGhost(){
        ghosts.forEach((ghost) => {
            ghost.draw();
        });
    }
        
    //GAME
    drawBorders();
    createPelletsArray();
    createBordersArray();
    createGhostsArray();
    createPacman();
    gameLoop();
    drawPellets();
    drawGhost();
    pacmanGetDirection();
    
    //La funzione che si ripete ogni frame e chiama le altre funzioni
    function gameLoop(){
        requestAnimationFrame(gameLoop);                            //richiama la funzione gameLoop 60 volte al secondo
        canvasContext.clearRect(0, 0, canvas.width, canvas.height); //pulisce il canvas ogni frame per evitare che pacman lasci una traccia
        pacmanSetSpeed();
        pelletsCollision();
        pacman.move();
        drawPellets();
        drawBorders();
        drawGhost();
    }
});

