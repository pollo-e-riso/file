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

    //La velocita' dei fantasmi
    const ghostSpeed = pacmanSpeed - 1;

    //const pacmanSpeed = window.screen.height / window.screen.width * 4;
    //const ghostSpeed = pacmanSpeed - pacmanSpeed * 0.2;

    //Il raggio del pacman
    const pacmanRadius = 18;

    //La posizione iniziale del pacman
    const pacmanStartPosition = borderSize + borderSize / 2;

    //Array con confini gia' creati(sara' riempito nel futuro tramite la funzione createBordersArray())
    const borders = [];

    //Array con le palline
    let pellets = [];

    //Array con i fantasmi
    let ghosts = [];

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

    let lives = 3;
    $("#lives").text(lives);

    //Visualizzazione del punteggio corrente e del punteggio massimo all'inizio del gioco
    $("#score").text(score);

    if (localStorage.getItem("highScore") == null) {// controlla se l'oggetto "highScore" esiste già nell'archivio localStorage. Se non esiste, viene creato con un valore iniziale di 0.
        localStorage.setItem("highScore", 0);
    }

    $("#highScore").text(localStorage.getItem("highScore"));

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
    //2 = pallina
    //3 = fantasma
    //4 = fantasma
    //5 = fantasma
    //6 = fantasma
    //9 = pallina grande
    const map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 9, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 2, 2, 1, 3, 0, 4, 1, 2, 2, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 1, 5, 0, 6, 1, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
        [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 9, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    //La classe per definire i confini
    class Border {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = borderSize;
            this.height = borderSize;
            this.color = color;
        }
    }
    //aggiunge hitbox ai bordi
    function createBordersArray() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 1) {
                    borders.push(new Border(j * borderSize, i * borderSize));   //aggiunge un nuovo confine all'array con coordinate x e y
                }
            }
        }
    }

    //La funzione per disegnare i rettagoli
    function createRectangle(x, y, width, height, color) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    }

    function drawBorders() {
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
    class Pacman {
        constructor(x, y, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.radius = pacmanRadius;
        }

        //il metodo per disegnare un cerchio
        draw() {
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            canvasContext.fillStyle = "yellow";
            canvasContext.fill();
            canvasContext.closePath();
        }

        //il metodo per aggiornare la posizione del pacman
        move() {
            this.draw();
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    //La funzione che crea il pacman in posizione specificata
    function createPacman() {
        pacman = new Pacman(pacmanStartPosition, pacmanStartPosition, 0, 0);
    }

    //La funzione che controlla l'ultima direzione premuta
    function pacmanGetDirection() {
        $(document).keydown((event) => {
            switch (event.key) {
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
            if (enableDebug) {
                console.log("up:" + directions.up.pressed + ", down:" + directions.down.pressed + ", right:" + directions.right.pressed + ", left:" + directions.left.pressed);
                console.log("last direction:" + lastDirection);
                console.log("key pressed:" + event.key)
            }
        });

        //se un tasto viene rilasciato, l'ultima direzione viene impostata a false
        $(document).keyup((event) => {
            switch (event.key) {
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
    function pacmanSetSpeed() {
        $(".arrow-button").css("background-color", "white");

        if (directions.up.pressed && lastDirection == "up") {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i];

                //passa un pacman con la velocità impostata a quella che avrebbe se premessimo il tasto
                if (isColliding({ ...pacman, speedX: 0, speedY: -pacmanSpeed }, border)) {
                    //se ci sarà una collisione, la velocità di pacman viene impostata a 0
                    pacman.speedY = 0;

                    if (enableDebug) {
                        console.log("future border collision");
                    }

                    break;
                } else {
                    //se non ci sarà una collisione, la velocità di pacman viene impostata a quella che avrebbe se premessimo il tasto
                    pacman.speedY = -pacmanSpeed;
                }
            }
            $("#arrow-up").css("background-color", "gray");
        } else if (directions.down.pressed && lastDirection == "down") {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i];

                if (isColliding({ ...pacman, speedX: 0, speedY: pacmanSpeed }, border)) {
                    pacman.speedY = 0;

                    if (enableDebug) {
                        console.log("future border collision");
                    }

                    break;
                } else {
                    pacman.speedY = pacmanSpeed;
                }
            }
            $("#arrow-down").css("background-color", "gray");
        } else if (directions.left.pressed && lastDirection == "left") {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i];

                if (isColliding({ ...pacman, speedX: -pacmanSpeed, speedY: 0 }, border)) {
                    pacman.speedX = 0;

                    if (enableDebug) {
                        console.log("future border collision");
                    }

                    break;
                } else {
                    pacman.speedX = -pacmanSpeed;
                }
            }
            $("#arrow-left").css("background-color", "gray");
        } else if (directions.right.pressed && lastDirection == "right") {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i];

                if (isColliding({ ...pacman, speedX: pacmanSpeed, speedY: 0 }, border)) {
                    pacman.speedX = 0;

                    if (enableDebug) {
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
    function collisionDetection() {
        borders.forEach((border) => {
            //se pacman collide con qualsiasi bordo, la sua velocità viene impostata a 0
            if (isColliding(pacman, border)) {
                pacman.speedX = 0;
                pacman.speedY = 0;

                if (enableDebug) {
                    console.log("border collision");
                }
            }
        });
    }

    //La funzione che prenda la posizione x/y del centro di pacman, aggiunge il suo raggio 
    //e la velocità in direzione appropriato e poi controlla se valore ottenuto è maggiore/minore
    //di quello del bordo 
    function isColliding(entity, border) {
        return (entity.y + entity.radius + entity.speedY >= border.y &&                       //down
                entity.y - entity.radius + entity.speedY <= border.y + border.height &&       //up
                entity.x + entity.radius + entity.speedX >= border.x &&                       //right
                entity.x - entity.radius + entity.speedX <= border.x + border.width)           //left
    }
    //PELLET
    
      class Pellet {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
        }

        //il metodo per disegnare un cerchio
        draw() {
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            canvasContext.fillStyle = "orange";
            canvasContext.fill();
            canvasContext.closePath();
        }
    }

    //La funzione che crea un array con le palline
    //Una funzione separata perché deve essere chiamata solo una volta
    function createPelletsArray() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 2) {
                    pellets.push(new Pellet(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, pacmanRadius / 3.8));
                }
                if (map[i][j] == 9) {
                    pellets.push(new Pellet(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, pacmanRadius / 1.5));
                }
            }
        }
    }

    //La funzione che disegna le palline
    function drawPellets() {
        pellets.forEach((pellet) => {
            pellet.draw();
        });
    }

    //La funzione che controlla se pacman collide con una pallina
    //Se sì, la pallina viene rimossa dall'array
    function pelletsCollision() {
        for (let i = pellets.length - 1; i >= 0; i--) { //scorre l'array al contrario per evitare problemi con processo di disegnamento delle palline
            const pellet = pellets[i];
            //se la distanza tra il centro di pacman e il centro della pallina è minore della somma dei loro raggi
            if (isCollidingCircle(pellet, pacman)) {
                if (enableDebug) {
                    console.log("pellet collision");
                }

                pellets.splice(i, 1);//cancella la pallina corrente dall'array
                
                //vinto
                if(pellets.length == 0){
                    resetGame(false);
                    startOnAction(false, "YOU'VE COMPLETED THE LEVEL! KEEP IT UP!");
                }

                if(pellet.radius == pacmanRadius / 1.5) {
                    ghosts.forEach((ghost) => {
                        ghost.isScared = true;
                        ghostMovement();
                        console.log(ghost.isScared)
                        setTimeout(() => {
                            ghost.isScared = false;
                        }
                        , 10000);
                    });     

                }
                score += 10;
                if (score > localStorage.getItem("highScore")) {//getItem mostra il valore
                    localStorage.setItem("highScore", score);//setItem permette di cambiarlo
                    $("#highScore").text(localStorage.getItem("highScore"));
                }
                $("#score").text(score);
            }
        }
    }

    function isCollidingCircle(entity1, entity2) {
        return (Math.hypot(entity1.x - entity2.x, entity1.y - entity2.y) < entity2.radius + entity1.radius);
    }
    /*funzione mangio palline grosse*/
    function bigPelletsCollision() {

    }
    //GHOSTS
    class Ghost {
        constructor(x, y, speedX, speedY, color) {
            this.x = x;
            this.y = y;
            this.speedX = speedX;
            this.speedY = speedY;
            this.radius = pacmanRadius;
            this.color = color;
            this.pastCollisions = [];
            this.isScared = false;
        }

        //il metodo per disegnare un cerchio
        draw() {
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            if(!this.isScared)
                canvasContext.fillStyle = this.color;
            else
                canvasContext.fillStyle = "purple";
            canvasContext.fill();
            canvasContext.closePath();
        }

        //il metodo per aggiornare la posizione del pacman
        move() {
            this.draw();
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    function createGhostsArray() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 3) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, -ghostSpeed, 0, "red"));
                }
                if (map[i][j] == 4) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, ghostSpeed, 0, "pink"));
                }
                if (map[i][j] == 5) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, ghostSpeed, "cyan"));
                }
                if (map[i][j] == 6) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, -ghostSpeed, "green"));
                }
            }
        }
    }

    function createGhostsArrayColor(color) {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 3 && color == "red") {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, -ghostSpeed, 0, "red"));
                }
                if (map[i][j] == 4 && color == "pink") {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, ghostSpeed, 0, "pink"));
                }
                if (map[i][j] == 5 && color == "cyan") {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, ghostSpeed, "cyan"));
                }
                if (map[i][j] == 6 && color == "green") {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, -ghostSpeed, "green"));
                }
            }
        }
    }

    function drawGhost() {
        ghosts.forEach((ghost) => {
            ghost.move();
        });
    }

    function ghostMovement() {
        ghosts.forEach((ghost) => {
            const ghostCollisions = [];
            borders.forEach((border) => {
                if (!ghostCollisions.includes("up") && (isColliding({ ...ghost, speedX: 0, speedY: -ghostSpeed }, border))) {     //up
                    ghostCollisions.push("up");
                }
                if (!ghostCollisions.includes("down") && isColliding({ ...ghost, speedX: 0, speedY: ghostSpeed }, border)) {      //down
                    ghostCollisions.push("down");
                }
                if (!ghostCollisions.includes("left") && isColliding({ ...ghost, speedX: -ghostSpeed, speedY: 0 }, border)) {     //left
                    ghostCollisions.push("left");
                }
                if (!ghostCollisions.includes("right") && isColliding({ ...ghost, speedX: ghostSpeed, speedY: 0 }, border)) {      //right
                    ghostCollisions.push("right");
                }
            });

            if (ghostCollisions.length > ghost.pastCollisions.length) {
                ghost.pastCollisions = ghostCollisions;
            }

            if (!(ghostCollisions.toString() == ghost.pastCollisions.toString())) {
                if (ghost.speedX > 0)
                    ghost.pastCollisions.push("right");
                if (ghost.speedX < 0)
                    ghost.pastCollisions.push("left");
                if (ghost.speedY < 0)
                    ghost.pastCollisions.push("up");
                if (ghost.speedY > 0)
                    ghost.pastCollisions.push("down");

                const possiblePaths = ghost.pastCollisions.filter(
                    collision => {
                        return !ghostCollisions.includes(collision);
                    }
                );


                const randomDirection = possiblePaths[Math.floor(Math.random() * possiblePaths.length)];
                switch(randomDirection) {
                    case "up":
                        ghost.speedX = 0;
                        ghost.speedY = -ghostSpeed;
                        break;
                    case "down":
                        ghost.speedX = 0;
                        ghost.speedY = ghostSpeed;
                        break;
                    case "left":
                        ghost.speedY = 0;
                        ghost.speedX = -ghostSpeed;
                        break;
                    case "right":
                        ghost.speedY = 0;
                        ghost.speedX = ghostSpeed;
                        break;
                }

                ghost.pastCollisions = [];
            }
            //console.log("Present:" + ghostCollisions)
            //console.log("Past:" + ghost.pastCollisions)
            //console.log("Possible:" + possiblePaths)
            //console.log(1)
        });
    }

    let ghostPlayerCollision = false;

    function ghostsCollision(){
        if(ghostPlayerCollision)
            return;

        for(let i = 0; i < ghosts.length; i++){
            const ghost = ghosts[i];
            if(isCollidingCircle(ghost, pacman) && !ghost.isScared){
                startOnAction(false, "PRESS ANY BUTTON TO CONTINUE PLAYING");
                ghostPlayerCollision = true;
                break;
            }
            if(isCollidingCircle(ghost, pacman) && ghost.isScared){
                let deadGhostColor = ghost.color;
                ghosts.splice(i, 1);
                score += 100;
                setTimeout(() => {
                    if(ghosts.length != 4)
                        createGhostsArrayColor(deadGhostColor);
                }, 5000);
                break;
            }
        }     
    }

    //GAME
    function startOnAction(isOnPageLoad, textToDisplay){  
        cancelAnimationFrame(frameID);//ferma il gioco

        if(lives - 1 == 0){
            //$("#livesText").addClass("last-lives");
            //$("#livestext").removeClass("last-lives");

            animationPagePacman();
            return;
        }

        $(".text").html(textToDisplay);

        $(document).one("keydown", () => {
            $(".text").html("");
            requestAnimationFrame(gameLoop);
            if(!isOnPageLoad)
                resetGame(true);
            if(lives == 1){
                $("#livesText").addClass("last-lives"); 
            }
            return;
        });
    }

    function resetGame(changeLives){
        if(changeLives)
            lives--;
        if(!changeLives){
            createPelletsArray(); 
        }
        if(lives == 0){
            lives = 3;
            score = 0;
            $("#score").text(score);
            pellets = [];
            createPelletsArray();
            $("#livesText").removeClass("last-lives"); 
        }
        $("#lives").text(lives);
        pacman.x = pacmanStartPosition;
        pacman.y = pacmanStartPosition;
        pacman.speedX = 0;
        pacman.speedY = 0;
        ghosts = [];
        createGhostsArray();
        ghostPlayerCollision = false;
    }

    function animationPagePacman(){
        $(".gameover").html("GAME OVER");

        setTimeout(function() {
        $(".pacman").animate({"left": "+=150%"}, 3000);
        $(".rettangolo").animate({"width": "+=150%"}, 3000);
    
        $(".pacmanD").animate({"left": "-=150%"}, 3000);
        $(".rettangoloD").animate({"width": "+=150%"}, 3000);

        }, 1500);

        setTimeout(function() {
            $(".gameover").html("");
            $(".rettangolo").animate({"width": "-=150%"}, 2000);

            $(".rettangoloD").animate({"width": "-=150%"}, 2000);

        }, 4500);

        setTimeout(function() {
            $(".pacman").css("left", "-=150%");
            $(".pacmanD").css("left", "+=150%");
            requestAnimationFrame(gameLoop);
            resetGame(true);

        }, 5000);
    }
    
    drawBorders();
    createPelletsArray();
    createBordersArray();
    createGhostsArray();
    drawPellets();
    drawGhost();
    ghostMovement();
    createPacman();
    gameLoop();
    pacmanGetDirection();
    startOnAction(true, "PRESS ANY BUTTON TO BEGIN PLAYING");

    //La funzione che si ripete ogni frame e chiama le altre funzioni
    function gameLoop() {
        frameID = requestAnimationFrame(gameLoop);                  //richiama la funzione gameLoop 60 volte al secondo
        canvasContext.clearRect(0, 0, canvas.width, canvas.height); //pulisce il canvas ogni frame per evitare che pacman lasci una traccia
        pacmanSetSpeed();
        pelletsCollision();
        ghostsCollision();
        pacman.move();
        drawPellets();
        drawBorders();
        drawGhost();
        ghostMovement();
    }
});

