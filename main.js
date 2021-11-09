'use strict';

const ball = {
    color: "white",
    radius:10,
    x:40,
    y:40,
    direction: { //0: don't move, 1: move right or down , -1: move left or up
       x: 0, //don't move <-->
       y: 1 //1, move up and down
    },
    speed: 6 
};


const paddle = {
    color: "white",
    x: 0, 
    y: 0, 
    w: 100, 
    h: 20, 
    direction: {
        x: 0 
    },
    speed: 10 
};

const game = {
    w: 0, 
    h: 0, 
    animationId: null, //stock requestAnimationFrame ID
    gameOver: false
};

const brick = {
    color: ["blue", "yellow", "green"],
    y: 50, 
    w: 100, 
    h: 20 
};

//tableau qui contiendra le nb de briques
const bricks = []; //il contiendra sur chaque ligne un object brick avec ces coordonnées

let canvasDom;
let ctx;



function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function valueDirection(x, w) { 
        if (ball.x + ball.radius <= x + (w /3)) {
            return -1;
        }
        else if (ball.x + ball.radius <= x + (w * 2/3)) {
            return 0;
        }
        else {
            return 1;
        }
}

function detectCollision() {

    //with paddle
    if (
        ball.y + ball.radius >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.direction.y == 1 ) {
        ball.direction.x = valueDirection(paddle.x, paddle.w);
        ball.direction.y = -1;
    }
    
    
    //collision avec les bricks
    if (ball.direction.y == -1) { 
        for (const itemBrick of bricks) {
            if (
                ball.y - ball.radius <= itemBrick.y + brick.h && ball.x >= itemBrick.x && ball.x <= itemBrick.x + brick.w && itemBrick.count > 0 ) {
                //if collision decrease countdown 
                itemBrick.count-- ;
                ball.direction.x = valueDirection(itemBrick.x, brick.w);
        
                ball.direction.y = 1;
            }
        }
    }
    

}

function showGameOver() {
    ctx.clearRect(0, 0, game.w, game.h);
    
    //display "GAME OVER !!" 
    ctx.font = 'bold 46px Verdana';
    ctx.fillStyle ='#FFFFFF';
    //console.log(ctx.measureText('GAME OVER !!!'));
    ctx.fillText('GAME OVER !!!', game.w/2 - ctx.measureText('GAME OVER !!!').width /2, game.h/2 - 15);
}

function playGame() {
    game.animationId = window.requestAnimationFrame(playGame);

    detectCollision();
    
    //If lose
    if(ball.y + ball.radius >= game.h) {
        window.cancelAnimationFrame(game.animationId);
        game.animationId = null;
        
        game.gameOver = true;
        showGameOver();
    }
      //top side windows
    if (ball.y - ball.radius <= 0) {
        ball.direction.y *= -1;
    }
    
    //right side windows
    if (ball.x + ball.radius >= game.w || ball.x - ball.radius <= 0) {
        ball.direction.x *= -1;
    }
    
    ball.y += ball.speed * ball.direction.y;
    ball.x += ball.speed * ball.direction.x;
    
    if (!game.gameOver) {
        showGame();
    }
}

function showBricks() {
    for (const itemBrick of bricks) {
        if (itemBrick.count > 0) { 
            ctx.fillStyle = brick.color[itemBrick.count -1]; 
       ctx.fillRect(itemBrick.x, itemBrick.y, brick.w, brick.h);
        }
    }
}

function showGame() {

    ctx.clearRect(0, 0, game.w, game.h);
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    paddle.x += paddle.direction.x * paddle.speed;
    
    if (paddle.x + paddle.w + paddle.speed > game.w) {
          //mettre le paddle sur le coté gauche
          paddle.x = game.w - paddle.w;
    }
    
    if (paddle.x - paddle.speed < 0) {
        paddle.x = 0;
    }

    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    showBricks();
    
}

function keyboardEvent(e) {
    switch (e.key) {
            case 'ArrowRight':
                if (e.type == 'keydown') {
                   paddle.direction.x = 1; //right way
                }
                else {
                   paddle.direction.x = 0;   //key up
                } 
                break;
            
            case 'ArrowLeft':
                if (e.type == 'keydown') {
                   paddle.direction.x = -1; //left way
                }
                else {
                   paddle.direction.x = 0; //key up
                }
                break;
                
            case ' ': //touche espace
                //lancer le jeu
                if (e.type == 'keydown') {
                    if (game.animationId == null && !game.gameOver) { //on lance le jeu
                        game.animationId = window.requestAnimationFrame(playGame);
                    }
                    else { //on temporise le jeu
                        window.cancelAnimationFrame(game.animationId);
                        game.animationId = null;
                    }
                }
                break;
        }
}

function init_bricks() {
    //combien on peut placer de brique à l'horizontal
    const nbBricks = Math.floor(game.w / brick.w);
    
    //calculer la coordonnée x de la première brick
    let x = Math.floor((game.w - (nbBricks * brick.w)) /2);
    
    //remplir le tableau bricks
    for (let i = 0; i < nbBricks; i++) {
        /*
        position x de la brique :
        la valeur de x de départ + (l'index de la brique x sa longueur)
        */
        let rndCount = getRandomIntInclusive(1, 3);
        bricks.push({
            x: x + (i * brick.w), //position x
            y: brick.y, //position y
            count: rndCount //nb de collosions possible
            
        });
    }
    
}


document.addEventListener('DOMContentLoaded', function () {

    canvasDom = document.getElementById('canvas');
    ctx = canvasDom.getContext('2d');
    
    canvasDom.width = window.innerWidth;
    canvasDom.height = window.innerHeight;
    
    game.w = canvasDom.width;
    game.h = canvasDom.height;
    
    //center paddle
    ball.x = game.w /2;
    ball.y = game.h - (80 + paddle.h + ball.radius + 1);
    
    
    paddle.x = (game.w /2) - (paddle.w /2);
    paddle.y = game.h - 80 - paddle.h;
    
    init_bricks();
    showGame();
   
    document.addEventListener('keydown', keyboardEvent); //KeyboardEvent c'est le callback de l'écouteur
    document.addEventListener('keyup', keyboardEvent);
});
