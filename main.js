'use strict';

// On défini les propriétés de la ball
const ball = {
    color: "red",
    radius:10,
    x:40,
    y:40,
    direction: { //0: pas de déplacement, 1: déplacement vers la droite ou vers le bas, -1: vers la gauche ou vers le haut
       x: 0, //0, pas de déplacement à l'horizontal
       y: 1 //1, déplacement du haut vers le bas
    },
    speed: 6 //vitesse de déplacement
};

//propriétés du paddle
const paddle = {
    color: "white",
    x: 0, //coordonnée x de la position
    y: 0, //coordonnée y de la position
    w: 100, //largeur du plateau
    h: 20, //hauteur du plateau
    direction: {
        x: 0 //pas de déplacement à l'horizontal
    },
    speed: 10 //vitesse de déplacement
};

//propriétés du game
const game = {
    w: 0, //largeur du canvas
    h: 0, //hauteur du canvas
    animationId: null //stocker l'ID de requestAnimationFrame
};

// Notre context et notre Canvas sont définis dans le Scope global pour un accès par nos fonctions
let canvasDom;
let ctx;

//déclaration des functions

function detectCollision() {
    /*
    si la ball touche le plateau, elle rebondie dessus :
    1 - rebondir sur l'axe des y
    
    quelle est la régle en fonction des propriétés qui sont sur le schéma, qui définie une collision ?
    
    3 conditions à respecter :
    
    - la verticale :
    
    la position y de la ball + son radius >= la position y du paddle
    
    - à l'horizontale :
    
        - la position x de la ball >= position x du paddle
        
        - la position x de la ball <= position x du paddle + largeur du paddle
        
    c'est uniquement si on a ces 3 conditions réunies, il y a collision 
    
    une collision ? c'est un rebond, quelle est la propriété que l'on doit changer pour faire ce rebond ?
    
    -> inverser ball.direction.y
    
    */
    if (
        ball.y + ball.radius >= paddle.y //la position y de la ball + son radius >= la position y du paddle
        && ball.x >= paddle.x //la position x de la ball >= position x du paddle
        && ball.x <= paddle.x + paddle.w //la position x de la ball <= position x du paddle + largeur du paddle
        ) {
        //ici on est certain qu'il ya collision  
        //gérer les angles
        
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
        
        
        
        
        
        //inverser la direction y de ball
        ball.direction.y *= -1;
    }
    
    /*
    2 - mettre des angles (ball.direction.x qui rentrer en jeu) et gérer les rebonds sur les cotés droit et gauche de l'écran
    
    1er tier de la largeur du paddle, on rebondie de 45° vers la gauche
    2nd tier -> on rebondie à la verticale
    3 eme tier -> on rebondie de 45° vers la droite 
    */
}

function showGame() {
    
    //récursivité sur showGame
    window.requestAnimationFrame(showGame);
    
    //test collision
    detectCollision();
    
    //effacer les dessins dessiner un rect qui va prendre toute la surface du canvas avec clearRect()
    ctx. clearRect(0, 0, game.w, game.h);
    
    //détecter si la ball touche le bas -> changer la direction
    
    //détecter si la ball touche le haut -> changer la direction
    
    if (ball.y + ball.radius >= game.h || ball.y - ball.radius <= 0) {
        // ball.direction.y = ball.direction.y * -1
        ball.direction.y *= -1;
        /*
        ball.direction.y définie le sens du déplacement :
        1 : on ajoute des px donc on descend (en fesant varier la coordonnée y)
        -1: on enlève des px donc on monte (en fesant varier la coordonnée y)
        */
    }
    
    //si la ball touche le coté droit ou gauche de l'écran
    if (ball.x + ball.radius >= game.w || ball.x - ball.radius <= 0) {
        ball.direction.x *= -1;
    }
    
    //déplacement de la ball sur les Y
    //changer le y de ball en fct de la vitesse et de la direction
    ball.y += ball.speed * ball.direction.y;
    
    //déplacement de la ball sur les X
    //changer le x de ball en fct de la vitesse et de la direction
    ball.x += ball.speed * ball.direction.x;
    
    //début du tracé
    ctx.beginPath();
    
    //définition de la couleur
    ctx.fillStyle = ball.color;
    
    //dessin de la ball
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    
    //appliquer la couleur
    ctx.fill();
    
    //deplacement du paddle en fct de la direction et de la vitesse (speed)
    /* 
    un deplacement vers la droite donnera : 1 * 10 -> de 10 px vers la droite
    un deplacement vers la gauche donnera : -1 * 10 -> on retranche 10px donc on se deplace vers la gauche
    quand on aura paddle.direction.x -> 0  => 0 * 10 -> ons se deplace pas
    */
    paddle.x += paddle.direction.x * paddle.speed;
    
    //test si on atteind le coté droit
    if (paddle.x + paddle.w + paddle.speed > game.w) {
          //mettre le paddle sur le coté gauche
          paddle.x = game.w - paddle.w;
    }
    
    //test si on atteind le coté gauche
    if (paddle.x - paddle.speed < 0) {
        paddle.x = 0;
    }
    
    //afficher le paddle
    //la couleur
    ctx.fillStyle = paddle.color;
    
    //dessiner le paddle
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    
}

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


// Dès que le DOM est chargé on commence
document.addEventListener('DOMContentLoaded', function () {

    //cibler le canvas
    canvasDom = document.getElementById('canvas');
    //recupération du contexte
    ctx = canvasDom.getContext('2d');
    
    //le canvas va prendre toute la taille de la fenêtre
    canvasDom.width = window.innerWidth;
    
    canvasDom.height = window.innerHeight;
    
    //récupérer les dimmensions du canvas
    game.w = canvasDom.width;
    
    game.h = canvasDom.height;
    
    //center la ball dans le canvas
    ball.x = game.w /2;
    
    ball.y = game.h /2;
    
    //placer le paddle au centre (horizontal) et à 80px du bas de l'écran (game.h)
    //mettre à jour paddle.x et paddle.y
    
    paddle.x = (game.w /2) - (paddle.w /2);
    
    paddle.y = game.h - 80 - paddle.h;
    
    //affichage du jeu
    window.requestAnimationFrame(showGame);
    
    //ecouter le clavier
    /*
    en fct des fleches, déplacer le paddle
    */
    
    /*
    on va déplacer le paddle dans la touche est enfoncée
    */
    document.addEventListener('keydown', keyboardEvent); //KeyboardEvent c'est le callback de l'écouteur
    
    /*
    on arretera de deplacer le paddle quand la touche est relevée
    */
    document.addEventListener('keyup', keyboardEvent);
    

});
