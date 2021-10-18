    let canvasDom;
    let ctx;
    const ball = {
        color: "#FF0000",
        radius:10,
        x:40,
        y:40,
        direction: { //0: pas de déplacement, 1: déplacement vers la droite ou vers le bas, -1: vers la gauche ou vers le haut
       x: 0, //0, no horizontal movement
       y: 1 //1, up and down
    },
    speed: 6 // speed //vitesse de déplacement
};
    
 
const canvas = {
    w: 0,
    h: 0,
    animationId: null //stocker l'ID de requestAnimationFrame
};

// paddle
const paddle = {
    color: "#FF0000",
    x:10,
    y:10,
    w: 100,
    h: 20,
    direction: {
        x: 0 // no horizontal movement
    },
    speed: 10 
};


function showBall() {
    window.requestAnimationFrame(showBall);
    
    ctx.clearRect(0, 0, canvas.w, canvas.h); //effacer les dessins
    ctx.beginPath(); //start drawing début du tracé
    ctx.fillStyle = ball.color;//définition de la couleur
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI); // circle //dessin un cercle
    ctx.fill();//appliquer la couleur
    ball.x += ball.direction.x;
    ball.y += ball.direction.y;
    
 
     //  Collision du paddle dans les conditions If de collision du canvas
     if (
         ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.h //border of the screen   on rebondie sur le haut de la fenetre
         || (ball.y + ball.radius >= paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w ) // on rebondie sur le paddle
         )  {
        
        ball.direction.y *= -1;
        
     };
     
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.w) {
         
         ball.direction.x *= -1;
     };
    
     // collision briques
     
     //game over
     
     if (ball.y + ball.radius >= canvas.h) {
            window.cancelAnimationFrame(canvas.animationId);
            canvas.animationId = null;
            alert("GAME OVER");
        }
        
        
    
    ball.y += ball.speed * ball.direction.y;
    
    ctx.beginPath(); //début du tracé
    ctx.fillStyle = ball.color; //définition de la couleur
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);  //dessin de la ball
    ctx.fill();//appliquer la couleur
    
    // deplacement paddle avec keydown
    paddle.x += paddle.direction.x * paddle.speed;
    
    //test si on atteind le coté droit
    if (paddle.x + paddle.w + paddle.speed > ball.w) {
          //mettre le paddle sur le coté gauche
          paddle.x = ball.w - paddle.w;
    }
    
    //test si on atteind le coté gauche
    if (paddle.x - paddle.speed < 0) {
        paddle.x = 0;
    }
    
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

}

// function bouger paddle fluide

function keyboardEvent(e) {
    switch (e.key) {
            case 'ArrowRight':
                
                if (e.type == 'keydown') { //la touche est bien enfoncée
                   paddle.direction.x = 1; //la direction va vers la droite
                }
                else {
                   paddle.direction.x = 0;   //la touche est relevé, on stop la direction du paddle
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



/*
*************
Code Principal
*************

*/

document.addEventListener('DOMContentLoaded', function () {
    canvasDom = document.getElementById('canvas');
    ctx = canvasDom.getContext('2d');
    
    canvasDom.width = window.innerWidth;
    canvasDom.height = window.innerHeight;

    canvas.w = canvasDom.width;
    canvas.h = canvasDom.height;
    
    //center la ball dans le canvas
    ball.x = canvas.w /2;
    ball.y = canvas.h /2;
    
    paddle.x = (canvas.w /2) - (paddle.w /2);
    paddle.y = canvas.h -80 - paddle.h;
    
    window.requestAnimationFrame(showBall);
    
    document.addEventListener('keydown', keyboardEvent); 
    document.addEventListener('keyup', keyboardEvent);
    

   
});
    
