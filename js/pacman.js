$(document).ready(() => {
    //palline grosse
    var audio2 = document.getElementById("myAudio2");

    //game over
    var audio5 = document.getElementById("myAudio5");

    //palline piccole(non ridere)
    var audio6 = document.getElementById("myAudio6");

    //palline grandi(non ridere x2)
    var audio7 = document.getElementById("myAudio7");

    //next level
    var audio8 = document.getElementById("myAudio8");

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

    //Il raggio del pacman
    const pacmanRadius = 18;

    //La posizione iniziale del pacman
    const pacmanStartPosition = borderSize + borderSize / 2;

    //Array con confini gia' creati(createBordersArray())
    const borders = [];

    //Array con le palline(createPelletsArray())
    let pellets = [];

    //Array con i fantasmi(createGhostsArray())
    let ghosts = [];

    //La grandezza dello spazio vuoto dentro un confine
    //Secondo valore deve essere piu' di 1
    const borderSpaceWidth = borderSize / 1.3;

    //Constante per lo spostamento dello spazio vuoto dentro un confine
    const borderOffset = (borderSize - borderSpaceWidth) / 2;

    //Boolean per accendere o spegnere la modalita' debug
    const enableDebug = false;

    //Impostazione della grandezza e altezza del tag canvas
    canvas.width = borderAmountHorizontal * borderSize - 240;
    canvas.height = borderAmountVertical * borderSize - 270;

    //Punteggio del giocatore
    let score = 0;

    //Vite del giocatore
    let lives = 3;
    $("#lives").text(lives);

    //Visualizzazione del punteggio corrente e del punteggio massimo all'inizio del gioco
    $("#score").text(score);

    //Controlla se l'oggetto "highScore" esiste già nell'archivio localStorage
    //Se non esiste, viene creato con un valore iniziale di 0
    if (localStorage.getItem("highScore") == null) {
        localStorage.setItem("highScore", 0);
    }

    //Visualizzazione del punteggio massimo
    $("#highScore").text(localStorage.getItem("highScore"));

    //Un oggetto che contiene tutti le possibili direzioni e se sono premute o no
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

    //Una stringa che contiene l'ultima direzione dell pacman
    let lastDirection = "";

    //una variabile per controllare se il pacman ha colliso con un fantasma
    //serve per evitare l'attivazione delle certe funzioni più di una volta
    let ghostPlayerCollision = false;

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
                    //aggiunge un nuovo confine all'array con coordinate x e y
                    borders.push(new Border(j * borderSize, i * borderSize));
                }
            }
        }
    }

    //La funzione per disegnare i rettagoli
    function createRectangle(x, y, width, height, color) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(x, y, width, height);
    }

    //La funzione per disegnare i confini
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

    //La funzione che controlla se un tasto è premuto e cambia la direzione del pacman
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
                    //così da non farlo andare nella direzione del confine 
                    //e non attivare la funzione di collisione che lo fermerebbe
                    pacman.speedY = 0;

                    if (enableDebug) {
                        console.log("future border collision");
                    }

                    break;
                } else {
                    //se non ci sarà una collisione, la velocità di pacman
                    //viene impostata a quella che avrebbe se premessimo il tasto
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
        //così da fermare pacman se collide con un bordo
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
                //pallina normale
                if (map[i][j] == 2) {
                    pellets.push(new Pellet(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, pacmanRadius / 3.8));
                }
                //pallina grossa
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
        //scorre l'array al contrario per evitare problemi con processo di disegnamento delle palline
        for (let i = pellets.length - 1; i >= 0; i--) {
            //una costante con la pallina corrente
            const pellet = pellets[i];

            //controllo della collisione tra pacman e una pallina
            if (isCollidingCircle(pellet, pacman)) {
                if (enableDebug) {
                    console.log("pellet collision");
                }

                //cancella la pallina corrente dall'array
                pellets.splice(i, 1);

                //condizone per la vittoria
                if (pellets.length == 0) {
                    nextlevel();
                }

                //audio per le palline
                if(pellet.radius == pacmanRadius / 3.8) {
                    audio6.play();
                }

                //collisione tra pacman e una pallina grossa
                if (pellet.radius == pacmanRadius / 1.5) {

                    audio7.play();

                    //cambia lo stato di tutti i fantasmi in "spaventato"
                    ghosts.forEach((ghost) => {
                        ghost.isScared = true;

                        if (enableDebug)
                            console.log(ghost.isScared)

                        //dopo 10 secondi cambia lo stato di tutti i fantasmi in "non spaventato"
                        setTimeout(() => {
                            ghost.isScared = false;
                        }
                            , 10000);
                    });

                }

                score += 10;

                //se il punteggio corrente è maggiore del punteggio più alto, il punteggio più alto viene aggiornato
                if (score > localStorage.getItem("highScore")) {
                    localStorage.setItem("highScore", score);
                    $("#highScore").text(localStorage.getItem("highScore"));
                }

                //aggiorna il testo con punteggio
                $("#score").text(score);
            }
        }
    }

    //La funzione che controlla conllisioni tra due cerchi
    //se la distanza tra il centro di un cerchio e il centro di un altro è minore della somma dei loro raggi
    //allora i cerchi si toccano
    function isCollidingCircle(entity1, entity2) {
        return (Math.hypot(entity1.x - entity2.x, entity1.y - entity2.y) < entity2.radius + entity1.radius);
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
            //un array con le collisioni passate
            this.pastCollisions = [];
            this.isScared = false;
        }

        //il metodo per disegnare un cerchio
        draw() {
            canvasContext.beginPath();
            canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            if (!this.isScared)
                canvasContext.fillStyle = this.color;
            else
                canvasContext.fillStyle = "purple";
            canvasContext.fill();
            canvasContext.closePath();
        }

        //il metodo per aggiornare la posizione di un fantasma
        move() {
            this.draw();
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    //La funzione per le istanze dei fantasmi
    function createGhostsArray() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                //rosso
                if (map[i][j] == 3) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, -ghostSpeed, 0, "red"));
                }
                //rosa
                if (map[i][j] == 4) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, ghostSpeed, 0, "pink"));
                }
                //ciano
                if (map[i][j] == 5) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, ghostSpeed, "cyan"));
                }
                //verde
                if (map[i][j] == 6) {
                    ghosts.push(new Ghost(j * borderSize + borderSize / 2, i * borderSize + borderSize / 2, 0, -ghostSpeed, "green"));
                }
            }
        }
    }

    //La funzione che crea instaze dei fantasmi basandosi sui colori
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

    //La funzione che disegna i fantasmi
    function drawGhost() {
        ghosts.forEach((ghost) => {
            ghost.move();
        });
    }

    //Gestione dei movimenti dei fantasmi
    function ghostMovement() {
        ghosts.forEach((ghost) => {

            //un array con le possibili collisioni di un fantasma in certo momento
            const ghostCollisions = [];

            borders.forEach((border) => {
                //up
                //se non è già presente una collisione in questa direzione in ghostCollisions 
                //e se ci potrebbe essere una collisione in questa direzione
                if (!ghostCollisions.includes("up") && (isColliding({ ...ghost, speedX: 0, speedY: -ghostSpeed }, border))) {
                    ghostCollisions.push("up");
                }
                //down
                if (!ghostCollisions.includes("down") && isColliding({ ...ghost, speedX: 0, speedY: ghostSpeed }, border)) {
                    ghostCollisions.push("down");
                }
                //left
                if (!ghostCollisions.includes("left") && isColliding({ ...ghost, speedX: -ghostSpeed, speedY: 0 }, border)) {
                    ghostCollisions.push("left");
                }
                //right
                if (!ghostCollisions.includes("right") && isColliding({ ...ghost, speedX: ghostSpeed, speedY: 0 }, border)) {
                    ghostCollisions.push("right");
                }
            });

            //se il numero di collisioni correnti è maggiore del numero di collisioni passate
            //allora c'è un cambio nelle direzioni possibili
            if (ghostCollisions.length > ghost.pastCollisions.length) {
                ghost.pastCollisions = ghostCollisions;
            }

            //se il numero di collisioni correnti non è uguale al numero di collisioni passate
            //allora ci sono nuove direzioni possibili
            if (!(ghostCollisions.toString() == ghost.pastCollisions.toString())) {
                if (ghost.speedX > 0)
                    ghost.pastCollisions.push("right");
                if (ghost.speedX < 0)
                    ghost.pastCollisions.push("left");
                if (ghost.speedY < 0)
                    ghost.pastCollisions.push("up");
                if (ghost.speedY > 0)
                    ghost.pastCollisions.push("down");

                //un array con le possibili direzioni
                const possiblePaths = [];

                //trova la differenza tra le collisioni correnti e quelle passate
                //e aggiungi le direzioni ottenute(possibili) all'array
                for (let i = 0; i < ghost.pastCollisions.length; i++) {

                    const collision = ghost.pastCollisions[i];

                    if (!ghostCollisions.includes(collision)) {
                        possiblePaths.push(collision);
                    }
                }

                //prende una direzione a caso tra quelle possibili
                const randomDirection = possiblePaths[Math.floor(Math.random() * possiblePaths.length)];

                //basandosi sulla direzione scelta, cambia la velocità del fantasma
                switch (randomDirection) {
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

                //resetta le collisioni passate 
                //per riniziare il processo
                ghost.pastCollisions = [];
            }
            if (enableDebug) {
                console.log("Present:" + ghostCollisions)
                console.log("Past:" + ghost.pastCollisions)
                console.log("Possible:" + possiblePaths)
            }
        });
    }

    //La funzione che gestisce le collisioni tra pacman e i fantasmi
    function ghostsPacmanCollision() {
        //se c'è già stata una collisione non fa niente 
        //per attivare codice sotto solo una volta
        if (ghostPlayerCollision)
            return;

        for (let i = 0; i < ghosts.length; i++) {
            const ghost = ghosts[i];
            //se un fantasma non è spaventato e collide con pacman
            if (isCollidingCircle(ghost, pacman) && !ghost.isScared) {
                //rinizia il gioco con una pause per input
                startOnAction(false, "PRESS ANY BUTTON TO CONTINUE PLAYING");
                //per segnalare che c'è già stata una collisione
                ghostPlayerCollision = true;
                break;
            }
            //se un fantasma è spaventato e collide con pacman
            if (isCollidingCircle(ghost, pacman) && ghost.isScared) {
                audio2.play();
                //memorizza il colore del fantasma morto
                let deadGhostColor = ghost.color;
                ghosts.splice(i, 1);
                score += 100;
                setTimeout(() => {
                    //crea un nuovo fantasma tra 5 secondi con il colore del fantasma morto
                    //se non ci sono 4 fantasmi già
                    if (ghosts.length != 4)
                        createGhostsArrayColor(deadGhostColor);
                }, 5000);
                break;
            }
        }
    }

    //GAME
    //La funzione che ferma il gioco e mostra un testo sullo schermo
    //Dopo un input risetta il gioco chiamando la funzione resetGame()
    //Il primo argomento controlla se è la prima volta che il gioco viene avviato
    //Testo puo essere cambiato con il secondo argomento
    function startOnAction(isOnPageLoad, textToDisplay) {
        //ferma il gioco
        cancelAnimationFrame(frameID);

        //se pacman ha perso tutte le vite
        if (lives - 1 == 0) {
            //animazione con i pacman
            animationPagePacman();
            return;
        }

        //mostra il testo specificato negli argomenti
        $(".text").text(textToDisplay);

        //aspetta un input
        $(document).one("keydown", () => {
            $(".text").text("");
            //riavvia il gioco
            requestAnimationFrame(gameLoop);
            //se non è la prima volta che il gioco viene avviato
            if (!isOnPageLoad)
                //risetta il gioco cambiando le vite
                resetGame(true);
            if (lives == 1) {
                //se è l'ultima vita aggiunge un'animazione al testo delle vite
                $("#livesText").addClass("last-lives");
            }
            return;
        });
    }

    //La funzione che risetta il gioco
    //L'argomento specifica se le vite devono essere cambiate
    function resetGame(changeLives) {
        if (changeLives)
            lives--;
        //se le vite non devono essere cambiate(=> il giocatore ha raccolto tutte le palline)
        if (!changeLives) {
            pellets = [];
            createPelletsArray();
        }
        //se il giocatore ha perso tutte le vite
        if (lives == 0) {
            lives = 3;
            score = 0;
            $("#score").text(score);
            pellets = [];
            createPelletsArray();
            //rimuove l'animazione al testo delle vite
            $("#livesText").removeClass("last-lives");
        }
        $("#lives").text(lives);
        pacman.x = pacmanStartPosition;
        pacman.y = pacmanStartPosition;
        pacman.speedX = 0;
        pacman.speedY = 0;
        ghosts = [];
        createGhostsArray();
        //per resettare la collisione tra pacman e i fantasmi
        ghostPlayerCollision = false;
    }

    //La funzione che gestisce l'animazione con i pacman
    function animationPagePacman() {
        $(".gameover").text("GAME OVER");
        audio5.play();
        setTimeout(function () {
            $(".pacman").animate({ "left": "+=150%" }, 3000);
            $(".rettangolo").animate({ "width": "+=150%" }, 3000);

            $(".pacmanD").animate({ "left": "-=150%" }, 3000);
            $(".rettangoloD").animate({ "width": "+=150%" }, 3000);

        }, 2000);

        setTimeout(function () {
            $(".gameover").text("");
            $(".rettangolo").animate({ "width": "-=150%" }, 2000);

            $(".rettangoloD").animate({ "width": "-=150%" }, 2000);

        }, 5000);

        setTimeout(function () {
            $(".pacman").css("left", "-=150%");
            $(".pacmanD").css("left", "+=150%");
            requestAnimationFrame(gameLoop);
            resetGame(true);

        }, 5500);
    }

    //Animazione per il cambio di livello
    function nextlevel(){
        cancelAnimationFrame(frameID);//ferma il gioco
        $(".next-level").text("N");
        audio8.play();
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "E");
            }, 600);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "X");
            }, 1200);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "T");
            }, 1800);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + " ");
            }, 2400);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "L");
            }, 3000);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "E");
            }, 3600);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "V");
            }, 4200);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "E");
            }, 4800);
        setTimeout(function() {
                $(".next-level").text($(".next-level").text() + "L");
            }, 5400);
        setTimeout(function() {
            $(".next-level").html("");
            requestAnimationFrame(gameLoop);
            resetGame(false);
            }, 6000);   
    }
    //La funzione che resetta max punteggio dopo un click(con confirm)
    function resetHighScoreClick() {
        $("#highScoreText").click(() => {
            let confirmed = window.confirm("Are you sure you want to reset your high score?");
            if (confirmed) {
                localStorage.setItem("highScore", 0);
                $("#highScore").text(localStorage.getItem("highScore"));
                return;
            }
            return;
        });
    }

    //Le funzioni che vengono chiamate una volta sola all'inizio del gioco
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
    resetHighScoreClick();

    //La funzione che si ripete ogni frame e chiama le altre funzioni
    function gameLoop() {
        //richiama la funzione gameLoop 60 volte al secondo
        frameID = requestAnimationFrame(gameLoop); 
        //pulisce il canvas ogni frame per aggiornarlo
        canvasContext.clearRect(0, 0, canvas.width, canvas.height); 
        pacmanSetSpeed();
        pelletsCollision();
        ghostsPacmanCollision();
        pacman.move();
        drawPellets();
        drawBorders();
        drawGhost();
        ghostMovement();
    }
});