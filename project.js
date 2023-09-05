"use strict";
let ctx;
let bombArray = [];
let wallX = 225, wallY = 125;
let isGameOver;
let score = 0;
let move = setInterval(enemyMovement, 500);

//create objects
function Player(x, y) {
    this.x = x;
    this.y = y;
}
let cat = new Player(25, 25);

function Enemy(x, y) {
    this.x = x;
    this.y = y;
}
bombArray.push(new Enemy(50 * random() + 25, 50 * random() + 25));

function Goal(x, y) {
    this.x = x;
    this.y = y;
}
let mouse = new Goal(50 * random() + 25, 50 * random() + 25);

function Trap(x, y) {
    this.x = x;
    this.y = y;
}
let mine = new Trap();


function setup() {
    ctx = document.getElementById("myCanvas").getContext("2d");
    document.getElementById("myCanvas").addEventListener("keydown", keyDowned);

    //give a random position to each coordinate

    while ((mouse.x == wallX || mouse.x == wallX+50) && (mouse.y == wallY || mouse.y == wallY+50 || mouse.y == wallY+100 || mouse.y == wallY+150 || mouse.y == wallY+200)) {
        mouse.x = 50 * random() + 25;  
        mouse.y = 50 * random() + 25;

        while (mouse.x == bombArray[0].x && mouse.y == bombArray[0].y) {
            mouse.x = 50 * random() + 25;  
            mouse.y = 50 * random() + 25;
        }
    }

    while ((bombArray[0].x == wallX || bombArray[0].x == wallX+50) && (bombArray[0].y == wallY || bombArray[0].y == wallY+50 || bombArray[0].y == wallY+100 || bombArray[0].y == wallY+150 || bombArray[0].y == wallY+200)) {
        bombArray[0].x = 50 * random() + 25;
        bombArray[0].y = 50 * random() + 25;

        while (mouse.x == bombArray[0].x && mouse.y == bombArray[0].y) {
            bombArray[0].x = 50 * random() + 25;
            bombArray[0].y = 50 * random() + 25;
        }
    }

    draw();
}

//return a random number from 1 to 10
function random() {
    let random = Math.round(Math.random() * 8)  + 1;
    return random;
}

//move the enemy in random direction(not on the wall)
function enemyMovement() {
    random();
    for (let i = 0; i < bombArray.length; i++) {
        if (isGameOver != true) {
            if (random() >= 1 && random() < 3) {
                bombArray[i].x += 50;
                if ((bombArray[i].x == wallX) && (bombArray[i].y == wallY || bombArray[i].y == wallY+50 || bombArray[i].y == wallY+100 || bombArray[i].y == wallY+150 || bombArray[i].y == wallY+200)) {
                    bombArray[i].x -= 100;
                }
            } else if (random() >= 3 && random() < 6) {
                bombArray[i].x -= 50;
                if ((bombArray[i].x == wallX+50) && (bombArray[i].y == wallY || bombArray[i].y == wallY+50 || bombArray[i].y == wallY+100 || bombArray[i].y == wallY+150 || bombArray[i].y == wallY+200)) {
                    bombArray[i].x += 100;
                }
            } else if (random() >= 6 && random() < 8) {
                bombArray[i].y += 50;
                if ((bombArray[i].x == wallX || bombArray[i].x == wallX+50) && bombArray[i].y == wallY) {
                    bombArray[i].y -= 100;
                }
            } else {
                bombArray[i].y -= 50;
                if ((bombArray[i].x == wallX || bombArray[i].x == wallX+50) && bombArray[i].y == wallY+200) {
                    bombArray[i].y += 100;
                }
            }
        }
        
        //keep enemy in the canvas
        if (bombArray[i].x <= 0) {
            bombArray[i].x += 100;
        } else if (bombArray[i].x >= 500) {
            bombArray[i].x -= 100;
        } else if (bombArray[i].y <= 0) {
            bombArray[i].y += 100;
        } else if (bombArray[i].y >= 500) {
            bombArray[i].y -= 100;
        }
    
        //if the enemy hits the goal, lose 150 points and place the goal in random location
        if (bombArray[i].x == mouse.x && bombArray[i].y == mouse.y) {
            mouse.x = 50 * random() + 25;
            mouse.y = 50 * random() + 25;

            while ((mouse.x == bombArray[i].x && mouse.y == bombArray[i].y) || (mouse.x == cat.x && mouse.y == cat.y)) {
                mouse.x = 50 * random() + 25;  
                mouse.y = 50 * random() + 25;
            }
            while ((mouse.x == wallX || mouse.x == wallX+50) && (mouse.y == wallY || mouse.y == wallY+50 || mouse.y == wallY+100 || mouse.y == wallY+150 || mouse.y == wallY+200)) {
                mouse.x = 50 * random() + 25;  
                mouse.y = 50 * random() + 25;
            }
            score -= 100;
            document.getElementById("score").innerHTML = score;
        }
        
        //when the enemy moves onto the mine, score 150 points
        //if there is only one bomb, place it in random position. Otherwise remove one of the enemies.   
        if (bombArray[i].x == mine.x && bombArray[i].y == mine.y) {
            score += 150;
            document.getElementById("score").innerHTML = score;
            mine.x = undefined, mine.y = undefined;
            if (bombArray.length == 1) {
                bombArray[i].x = 50 * random() + 25;  
                bombArray[i].y = 50 * random() + 25;
        
                while ((mouse.x == bombArray[i].x && mouse.y == bombArray[i].y) || (mouse.x == cat.x && mouse.y == cat.y)) {
                    mouse.x = 50 * random() + 25;  
                    mouse.y = 50 * random() + 25;
                }
                while ((mouse.x == wallX || mouse.x == wallX+50) && (mouse.y == wallY || mouse.y == wallY+50 || mouse.y == wallY+100 || mouse.y == wallY+150 || mouse.y == wallY+200)) {
                    mouse.x = 50 * random() + 25;  
                    mouse.y = 50 * random() + 25;
                }
            } else {
            bombArray.pop();
            }
        }
    }
    draw();

    //When the enemy hits the player, display the message GAME OVER and update the game status(whether it's over or not)
    for (let i = 0; i < bombArray.length; i++) {
        if (bombArray[i].x == cat.x && bombArray[i].y == cat.y) {
            ctx.save()
            ctx.beginPath();
            ctx.font = "80px Georgia";
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER!", 0, 275);
            ctx.restore();
            isGameOver = true;
        }
    }

}

//event handler
function keyDowned(event) {
    ctx.clearRect(cat.x-23, cat.y-23, 46, 46);

    let k = event.key;

    //if game isn't over, move the player
    //if player hit the wall, move back. Otherwise, move forward
    //When you press space bar, place a mine on that location
    if (isGameOver != true) {
        if (k == "ArrowUp") {
            cat.y -= 50;
            if ((cat.x == wallX || cat.x == wallX+50) && (cat.y == wallY+200)) {
                cat.y += 50;
            }
        } else if (k == "ArrowRight") {
            cat.x += 50;
            if ((cat.x == wallX) && (cat.y == wallY || cat.y == wallY+50 || cat.y == wallY+100 || cat.y == wallY+150 || cat.y == wallY+200)) {
                cat.x -= 50;
            }
        } else if (k == "ArrowDown") {
            cat.y += 50;
            if ((cat.x == wallX || cat.x == wallX+50) && cat.y == wallY) {
                cat.y -= 50;
            }
        } else if (k == "ArrowLeft") {
            cat.x -=50;
            if (cat.x == wallX+50 && (cat.y == wallY || cat.y == wallY+50 || cat.y == wallY+100 || cat.y == wallY+150 || cat.y == wallY+200)) {
                cat.x += 50;
            }
        } else if (k == " ") {
            mine.x = cat.x;
            mine.y = cat.y;
        }
     
    }

    //keep the player in the grid
    if (cat.x <= 0) {
        cat.x += 50;
    } else if (cat.x >= 500) {
        cat.x -= 50;
    } else if (cat.y <= 0) {
        cat.y += 50;
    } else if (cat.y >= 500) {
        cat.y -= 50;
    }

    //when the player hits the mouse, locate the mouse in random location
    //then increase the score by 100 and add a new enemy
    if (cat.x == mouse.x && cat.y == mouse.y) {
        mouse.x = 50 * random() + 25;
        mouse.y = 50 * random() + 25;

        for (let i = 0; i < bombArray.length; i++) {
            while ((mouse.x == bombArray[i].x && mouse.y == bombArray[0].y) || (mouse.x == cat.x && mouse.y == cat.y)) {
                mouse.x = 50 * random() + 25;  
                mouse.y = 50 * random() + 25;

                while (mouse.x == bombArray[i].x && mouse.y == bombArray[i].y) {
                    mouse.x = 50 * random() + 25;  
                    mouse.y = 50 * random() + 25;
                }
            }

            while ((mouse.x == wallX || mouse.x == wallX+50) && (mouse.y == wallY || mouse.y == wallY+50 || mouse.y == wallY+100 || mouse.y == wallY+150 || mouse.y == wallY+200)) {
                mouse.x = 50 * random() + 25;  
                mouse.y = 50 * random() + 25;

                while (mouse.x == bombArray[i].x && mouse.y == bombArray[i].y) {
                    mouse.x = 50 * random() + 25;  
                    mouse.y = 50 * random() + 25;
                }
            }
        }
        score += 100;
        document.getElementById("score").innerHTML = score;

        bombArray.push(new Enemy(50 * random() + 25, 50 * random() + 25));

        while ((bombArray[bombArray.length-1].x == wallX || bombArray[bombArray.length-1].x == wallX+50) && (bombArray[bombArray.length-1].y == wallY || bombArray[bombArray.length-1].y == wallY+50 || bombArray[bombArray.length-1].y == wallY+100 || bombArray[bombArray.length-1].y == wallY+150 || bombArray[bombArray.length-1].y == wallY+200)) {
            bombArray[bombArray.length-1].x = 50 * random() + 25;
            bombArray[bombArray.length-1].y = 50 * random() + 25;
    
            while (mouse.x == bombArray[bombArray.length-1].x && mouse.y == bombArray[bombArray.length-1].y) {
                bombArray[bombArray.length-1].x = 50 * random() + 25;
                bombArray[bombArray.length-1].y = 50 * random() + 25;
            }
            while (cat.x == bombArray[bombArray.length-1].x && cat.y == bombArray[bombArray.length-1].y) {
                bombArray[bombArray.length-1].x = 50 * random() + 25;
                bombArray[bombArray.length-1].y = 50 * random() + 25;
            }
        }
    }

    draw();

    //Display the message GAME OVER and update the game status(whether it's over or not)
    for (let i = 0; i < bombArray.length; i++) {
        if (cat.x == bombArray[i].x && cat.y == bombArray[i].y) {
            ctx.save()
            ctx.beginPath();
            ctx.font = "80px Georgia";
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER!", 0, 275);
            ctx.restore()
            isGameOver = true;
        }
    }

}

function reset() {
    score = 0;
    document.getElementById("score").innerHTML = score;
    cat.x = 25, cat.y = 25;
    mine.x = undefined, mine.y = undefined;

    mouse.x = 50 * random() + 25;
    mouse.y = 50 * random() + 25;

    bombArray = [];

    bombArray.push(new Enemy(50 * random() + 25, 50 * random() + 25));

    while ((mouse.x == wallX || mouse.x == wallX+50) && (mouse.y == wallY || mouse.y == wallY+50 || mouse.y == wallY+100 || mouse.y == wallY+150 || mouse.y == wallY+200)) {
        mouse.x = 50 * random() + 25;  
        mouse.y = 50 * random() + 25;

        while (mouse.x == bombArray[0].x && mouse.y == bombArray[0].y) {
            mouse.x = 50 * random() + 25;  
            mouse.y = 50 * random() + 25;
        }
    }

    while ((bombArray[0].x == wallX || bombArray[0].x == wallX+50) && (bombArray[0].y == wallY || bombArray[0].y == wallY+50 || bombArray[0].y == wallY+100 || bombArray[0].y == wallY+150 || bombArray[0].y == wallY+200)) {
        bombArray[0].x = 50 * random() + 25;
        bombArray[0].y = 50 * random() + 25;

        while (mouse.x == bombArray[0].x && mouse.y == bombArray[0].y) {
            mouse.x = 50 * random() + 25;  
            mouse.y = 50 * random() + 25;
        }
    }

    isGameOver = false;
    draw();
}

function drawBoard() {
    let x = 50, y = 0;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "yellowgreen";
    ctx.rect(0, 0, 500, 500);
    ctx.fill();

    ctx.strokeStyle = "#ebbf46";
    ctx.lineWidth = "2";

    //draw horizontal lines
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(x, 500);
        ctx.stroke();
        x += 50;   
    }
    
    x = 0, y = 50; 

    //draw vertical lines
    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.lineTo(x, y);
        ctx.lineTo(500, y);
        ctx.stroke();
        y += 50;
    }

    //draw flower
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    ctx.lineWidth = 1;
    ctx.arc(400, 200, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(390, 182, 15,  0.4 * Math.PI, 0.9 * Math.PI);
    ctx.arc(380, 194, 15, 1.4 * Math.PI, 1.9 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(408, 182, 15, 0.75 * Math.PI, 1.35 * Math.PI);
    ctx.arc(393, 182, 15, 1.75 * Math.PI, 0.25 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(420, 199, 15, 1.1 * Math.PI, 1.6 * Math.PI);
    ctx.arc(412, 185, 15, 0.1 * Math.PI, 0.6 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(404, 215, 15, 1.6 * Math.PI, 0.1 * Math.PI);
    ctx.arc(415, 204, 15, 0.4 * Math.PI, 0.9 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(383, 203, 15, 0.1 * Math.PI, 0.6 * Math.PI);
    ctx.arc(391, 215, 15, Math.PI, 1.5 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.rect(398, 207, 2, 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(397, 225, 15, 0.5 * Math.PI, Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(401, 225, 15, 0, 0.5 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(600, 600, 30, 0, 2 * Math.PI);
    ctx.stroke();

    //draw wall
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 2; j++) {
            ctx.beginPath();
            ctx.fillStyle = "SteelBlue";
            ctx.rect(wallX-24, wallY-24, 48, 48);
            ctx.fill();
            wallX += 50;
        }
        wallX -= 100;
        wallY += 50;
    }
    wallY -= 250;

    ctx.beginPath();
    ctx.translate(-300, 150);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    ctx.lineWidth = 1;
    ctx.arc(400, 200, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "pink";
    ctx.arc(390, 182, 15,  0.4 * Math.PI, 0.9 * Math.PI);
    ctx.arc(380, 194, 15, 1.4 * Math.PI, 1.9 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(408, 182, 15, 0.75 * Math.PI, 1.35 * Math.PI);
    ctx.arc(393, 182, 15, 1.75 * Math.PI, 0.25 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(420, 199, 15, 1.1 * Math.PI, 1.6 * Math.PI);
    ctx.arc(412, 185, 15, 0.1 * Math.PI, 0.6 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(404, 215, 15, 1.6 * Math.PI, 0.1 * Math.PI);
    ctx.arc(415, 204, 15, 0.4 * Math.PI, 0.9 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(383, 203, 15, 0.1 * Math.PI, 0.6 * Math.PI);
    ctx.arc(391, 215, 15, Math.PI, 1.5 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.rect(398, 207, 2, 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(397, 225, 15, 0.5 * Math.PI, Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(401, 225, 15, 0, 0.5 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(600, 600, 30, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.translate(300, -150);
    ctx.translate(150, 100);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.lineTo(-8, 2);
    ctx.lineTo(-12, -20);
    ctx.lineTo(-3, -2);
    ctx.lineTo(-1, -25);
    ctx.lineTo(2, -2);
    ctx.lineTo(9, -20);
    ctx.lineTo(6, 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.translate(-150, -100);
    ctx.lineTo(442, 452);
    ctx.lineTo(438, 430);
    ctx.lineTo(447, 448);
    ctx.lineTo(449, 425);
    ctx.lineTo(452, 448);
    ctx.lineTo(459, 430);
    ctx.lineTo(456, 452);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(242, 402);
    ctx.lineTo(238, 380);
    ctx.lineTo(247, 398);
    ctx.lineTo(249, 375);
    ctx.lineTo(252, 398);
    ctx.lineTo(259, 380);
    ctx.lineTo(256, 402);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, 500, 500);
    drawBoard();
    drawCat(cat.x, cat.y);
    drawMouse(mouse.x, mouse.y);
    for (let i = 0; i < bombArray.length; i++) {
        drawBomb(bombArray[i].x, bombArray[i].y);
    }
    if (mine.x != undefined && mine.y != undefined) {
        drawMine(mine.x, mine.y);
    }
}


function drawCat(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = "Gold";
    ctx.rect(-10, -16.5, 32, 32);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "Salmon";
    ctx.lineTo(-10, -16.5);
    ctx.lineTo(-22, -10);
    ctx.lineTo(-10, -3);
    ctx.fill();
    ctx.stroke();
     
    ctx.beginPath();
    ctx.lineTo(-10, 4)
    ctx.lineTo(-22, 9);
    ctx.lineTo(-10, 16);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(5, -6, 3, 0, 2 * Math.PI);
    ctx.arc(5, 7, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(15, -4, 5, 3 * Math.PI / 2, Math.PI / 2);
    ctx.arc(15, 5, 5, 3 * Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.lineTo(8, -15);
    ctx.lineTo(6, -22);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(10, -15);
    ctx.lineTo(12, -22);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(8, 15);
    ctx.lineTo(6, 22);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(10, 15);
    ctx.lineTo(12, 22);
    ctx.stroke();

    ctx.restore();
}

function drawMouse(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = "DarkGrey";
    ctx.arc(0, 5, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "DarkGrey";
    ctx.arc(-13.5, -13.5, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "DarkGrey";
    ctx.arc(13.5, -13.5, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "Salmon";
    ctx.arc(-13.5, -13.5, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "Salmon";
    ctx.arc(13.5, -13.5, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(-6, 2, 2, 0, 2 * Math.PI);
    ctx.arc(6, 2, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.lineTo(-3, 9);
    ctx.lineTo(3, 9);
    ctx.lineTo(0, 12);
    ctx.fill();

    ctx.beginPath();
    ctx.lineTo(5, 9);
    ctx.lineTo(17, 7);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(5, 13);
    ctx.lineTo(17, 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(-5, 9);
    ctx.lineTo(-17, 7);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(-5, 13);
    ctx.lineTo(-17, 15);
    ctx.stroke();

    ctx.restore();
}

function drawBomb(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 5, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.rect(-5, -15, 10, 10);
    ctx.fill();
    
    ctx.beginPath();
    ctx.strokeStyle = "Tomato";
    ctx.arc(5, -13, 5, Math.PI, 1.5 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(5, -23, 5, 0, 0.5 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = "3";
    ctx.arc(0, 5, 7, 0.8 * Math.PI, 1.3 * Math.PI);
    ctx.stroke();
    
    ctx.restore(); 

}

function drawMine(x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.fillStyle = "red";
    ctx.lineWidth = "2";
    ctx.strokeStyle = "yellow";
    ctx.arc(-17, 17, 15, 1.5 * Math.PI, 2 * Math.PI);
    ctx.arc(17, 17, 15, Math.PI, 1.5 * Math.PI);
    ctx.arc(17, -17, 15, 0.5 * Math.PI, Math.PI);
    ctx.arc(-17, -17, 15, 0, 0.5 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}