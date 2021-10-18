'use strict';

const ball = {
    color: "red",
    radius:10,
    x:40,
    y:40,
    direction: {
       x: 0, 
       y: 1 
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
    animationId: null //stocker l'ID de requestAnimationFrame
};

let canvasDom;
let ctx;

function detectCollision() {
    if (
        ball.y + ball.radius >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w ) {
        
        //1er tier
        if (ball.x + ball.radius <= paddle.x + (paddle.w /3)) {
            ball.direction.x = -1;
        }
        else if (ball.x + ball.radius <= paddle.x + (paddle.w * 2/3)) {//2nd tier
            ball.direction.x = 0;
        }
        else {//3ieme tier
            ball.direction.x = 1;
        }
        ball.direction.y *= -1;
}

function showGame() {
    window.requestAnimationFrame(showGame);
    detectCollision();
    
    ctx. clearRect(0, 0, game.w, game.h);
    
    if (ball.y + ball.radius >= game.h || ball.y - ball.radius <= 0) {
        ball.direction.y *= -1;
    }
    
    //touch border
    if (ball.x + ball.radius >= game.w || ball.x - ball.radius <= 0) {
        ball.direction.x *= -1;
    }
    ball.y += ball.speed * ball.direction.y;
    ball.x += ball.speed * ball.direction.x;
    
    //start drawing
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    paddle.x += paddle.direction.x * paddle.speed;
    //if touch border
    if (paddle.x + paddle.w + paddle.speed > game.w) {
          //go left
          paddle.x = game.w - paddle.w;
    }
    //if touch border
    if (paddle.x - paddle.speed < 0) {
        paddle.x = 0;
    }
    
    //color
    ctx.fillStyle = paddle.color;
    //dessiner le paddle
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h); 
}

function keyboardEvent(e) {
    switch (e.key) {
            case 'ArrowRight':
                if (e.type == 'keydown') { 
                   paddle.direction.x = 1; //go right          
                }
                else {
                   paddle.direction.x = 0;
                }
                break;
            case 'ArrowLeft':
                if (e.type == 'keydown') {
                   paddle.direction.x = -1; //la direction va vers la gauche
                }
                else {
                   paddle.direction.x = 0; //la touche est relevé, on stop la direction du paddle 
                }
                break;
        }
}


// Dès que le DOM est chargé on commence
document.addEventListener('DOMContentLoaded', function () {
    
    canvasDom = document.getElementById('canvas');
    ctx = canvasDom.getContext('2d');

    canvasDom.width = window.innerWidth;
    canvasDom.height = window.innerHeight;
    
    //get canvas width/height
    game.w = canvasDom.width;
    game.h = canvasDom.height;
    
    //center ball
    ball.x = game.w /2;    
    ball.y = game.h /2;
    
    //center paddle
    paddle.x = (game.w /2) - (paddle.w /2);
    paddle.y = game.h - 80 - paddle.h;
    
    //affichage du jeu
    window.requestAnimationFrame(showGame);

    document.addEventListener('keydown', keyboardEvent); 
    document.addEventListener('keyup', keyboardEvent);
    
});
