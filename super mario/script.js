const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gravity = 0.7;

let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;

const player = {
    x:100,
    y:200,
    width:40,
    height:50,
    vx:0,
    vy:0,
    speed:5,
    jump:-14,
    grounded:false
};

const keys = {};

const platforms = [
    {x:0,y:450,w:2500,h:50},
    {x:300,y:350,w:200,h:20},
    {x:650,y:300,w:200,h:20},
    {x:1000,y:250,w:200,h:20},
    {x:1400,y:320,w:250,h:20},
    {x:1800,y:220,w:250,h:20}
];

const coins = [
    {x:350,y:300,collected:false},
    {x:700,y:250,collected:false},
    {x:1050,y:200,collected:false},
    {x:1500,y:270,collected:false},
    {x:1850,y:170,collected:false}
];

const enemies = [
    {x:500,y:410,w:40,h:40,dir:1},
    {x:1200,y:210,w:40,h:40,dir:-1},
    {x:1700,y:280,w:40,h:40,dir:1}
];

const flag = {
    x:2300,
    y:100,
    w:20,
    h:300
};

let cameraX = 0;

document.addEventListener("keydown",e=>{
    keys[e.key]=true;
});

document.addEventListener("keyup",e=>{
    keys[e.key]=false;
});

function resetPlayer(){
    player.x=100;
    player.y=200;
    player.vx=0;
    player.vy=0;
}

function update(){

    if(gameOver || gameWon) return;

    if(keys["ArrowLeft"])
        player.vx=-player.speed;
    else if(keys["ArrowRight"])
        player.vx=player.speed;
    else
        player.vx=0;

    if((keys[" "] || keys["ArrowUp"]) && player.grounded){
        player.vy=player.jump;
        player.grounded=false;
    }

    player.vy+=gravity;

    player.x+=player.vx;
    player.y+=player.vy;

    player.grounded=false;

    platforms.forEach(p=>{

        if(
            player.x < p.x+p.w &&
            player.x+player.width > p.x &&
            player.y+player.height > p.y &&
            player.y+player.height < p.y+30 &&
            player.vy>=0
        ){
            player.y=p.y-player.height;
            player.vy=0;
            player.grounded=true;
        }
    });

    enemies.forEach(enemy=>{

        if (enemy.dead) return;

        if (enemy.minX === undefined) enemy.minX = enemy.x - 100;
        if (enemy.maxX === undefined) enemy.maxX = enemy.x + 100;

        enemy.x += enemy.dir * 2;

        if (enemy.x < enemy.minX || enemy.x > enemy.maxX)
            enemy.dir *= -1;

        if(
            player.x < enemy.x+enemy.w &&
            player.x+player.width > enemy.x &&
            player.y < enemy.y+enemy.h &&
            player.y+player.height > enemy.y
        ){

            if(player.vy > 0 &&
               player.y+player.height < enemy.y+20){

                enemy.dead = true;
                score += 100;
                player.vy = -10;
            }
            else{
                lives--;

                if(lives<=0){
                    gameOver=true;
                }

                resetPlayer();
            }
        }
    });

    for(let coin of coins){

        if(!coin.collected &&
           player.x < coin.x+20 &&
           player.x+player.width > coin.x &&
           player.y < coin.y+20 &&
           player.y+player.height > coin.y){

            coin.collected=true;
            score += 10;
        }
    }

    if(
        player.x < flag.x+flag.w &&
        player.x+player.width > flag.x &&
        player.y < flag.y+flag.h &&
        player.y+player.height > flag.y
    ){
        gameWon=true;
    }

    if(player.y > canvas.height){
        lives--;

        if(lives<=0){
            gameOver=true;
        }

        resetPlayer();
    }

    cameraX = player.x - 250;
}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.save();

    ctx.translate(-cameraX,0);

    platforms.forEach(p=>{
        ctx.fillStyle="green";
        ctx.fillRect(p.x,p.y,p.w,p.h);
    });

    coins.forEach(c=>{

        if(!c.collected){

            ctx.beginPath();
            ctx.fillStyle="gold";
            ctx.arc(c.x,c.y,10,0,Math.PI*2);
            ctx.fill();
        }
    });

    enemies.forEach(e=>{

        if(!e.dead){

            ctx.fillStyle="brown";
            ctx.fillRect(e.x,e.y,e.w,e.h);

            ctx.fillStyle="white";
            ctx.fillRect(e.x+8,e.y+10,5,5);
            ctx.fillRect(e.x+25,e.y+10,5,5);
        }
    });

    ctx.fillStyle="red";
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    ctx.fillStyle="black";
    ctx.fillRect(flag.x,flag.y,5,flag.h);

    ctx.fillStyle="yellow";
    ctx.fillRect(flag.x,flag.y,40,25);

    ctx.restore();

    ctx.fillStyle="black";
    ctx.font="24px Arial";

    ctx.fillText("Score: "+score,20,30);
    ctx.fillText("Lives: "+lives,20,60);

    if(gameOver){
        ctx.font="60px Arial";
        ctx.fillText("GAME OVER",300,250);
    }

    if(gameWon){
        ctx.font="60px Arial";
        ctx.fillText("YOU WIN!",350,250);
    }
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
