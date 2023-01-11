const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const card = document.getElementById("tarjeta");
const cardpuntaje = document.getElementById("puntaje");

//VARIABLES GLOBALES



let puntajeSFX = new Audio("https://archive.org/download/classiccoin/classiccoin.wav");
let gameOverSFX = new Audio("https://archive.org/download/smb_gameover/smb_gameover.wav");
let SALTOSFX = new Audio("https://archive.org/download/SALTO_20210424/SALTO.wav");





//FUNCIONES Y OBJETOS

let jugador = null;
let puntaje = 0;
let puntajeIncremento = 0;
let pinchos = [];
let velocidadPinchos = 5;
let canpuntaje = true;
let tiempo = 1000;

function COMENZAR() {
    jugador = new Player(150,350,50,"blue");
    pinchos = [];
    puntaje = 0;
    puntajeIncremento = 0;
    velocidadPinchos = 5;
    canpuntaje = true;
    tiempo = 1000;
}

function numeroRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


function COLISION(jugador,block){
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(jugador)), jugador);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);

    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x>s2.x+s2.size || 
        s1.x+s1.size<s2.x || 
        s1.y>s2.y+s2.size || 
        s1.y+s1.size<s2.y 
    )
}


function MARCAPUNTO(jugador, block){
    return(
        jugador.x + (jugador.size / 2) > block.x + (block.size / 4) && 
        jugador.x + (jugador.size / 2) < block.x + (block.size / 4) * 3
    )
}

class Player {
    constructor(x,y,size,color){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.SALTOHeight = 10;
 
        this.hacerSALTO = false;
        this.SALTOcontar = 0;
        this.SALTOUp = true;

        this.spin = 0;
     
        this.spinIncremento = 90 / 32;
    }

    CONSTRUIR() {
        this.SALTO();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);

        if(this.hacerSALTO) this.contarROTACION();
    }

    SALTO() {
        if(this.hacerSALTO){
            this.SALTOcontar++;
            if(this.SALTOcontar < 15){
                this.y -= this.SALTOHeight;
            }else if(this.SALTOcontar > 14 && this.SALTOcontar < 19){
                this.y += 0;
            }else if(this.SALTOcontar < 33){
                this.y += this.SALTOHeight;
            }
            this.ROTACION();
            if(this.SALTOcontar >= 32){
           
                this.contarROTACION();
                this.spin = 0;
                this.hacerSALTO = false;
            }
        }    
    }
    

    ROTACION() {
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition,offsetYPosition);

        ctx.rotate(this.spin * Math.PI / 180);
        ctx.rotate(this.spinIncremento * Math.PI / 180 );
        ctx.translate(-offsetXPosition,-offsetYPosition);
   
        this.spin += this.spinIncremento;
    }

    contarROTACION() {
     
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition,offsetYPosition);
        ctx.rotate(-this.spin * Math.PI / 180 );
        ctx.translate(-offsetXPosition,-offsetYPosition);
    }

}

class PINCHOSS {
    constructor(size, speed){
        this.x = canvas.width + size;
        this.y = 400 - size;
        this.size = size;
        this.color = "red";
        this.slideSpeed = speed;
    }

    CONSTRUIR() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x +10,this.y +50,this.size,this.size);
        ctx.lineTo(this.x +30,this.y -40,this.size,this.size);  // la y es el punto de arriba
        ctx.lineTo(this.x +50,this.y +50,this.size,this.size); // la y es el punto de abajo
        ctx.closePath(); 
        ctx.strokeStyle = "red";
        ctx.stroke();
        

    }

    slide() {
        this.CONSTRUIR();
        this.x -= this.slideSpeed;
    }
    
}



function crearBloques() {


    let timing = tiempoRandom(tiempo);
    pinchos.push(new PINCHOSS(50, velocidadPinchos));


    setTimeout(crearBloques, timing);
}

function tiempoRandom(intervaloR) {
    let tiempoR = intervaloR;
    if(Math.random() < 0.5){
        tiempoR += numeroRandom(tiempo / 3, tiempo * 1.5);
    }else{
        tiempoR -= numeroRandom(tiempo / 5, tiempo / 2);
    }
    return tiempoR;
}

function CONSTRUIRsuelo() {
    ctx.beginPath();
    ctx.moveTo(0,400);
    ctx.lineTo(600,400);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "red";
    ctx.stroke();
}

function CONSTRUIRpuntaje() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let puntajeString = puntaje.toString();
    let xOffset = ((puntajeString.length - 1) * 20);
    ctx.fillText(puntajeString, 280 - xOffset, 100);
}

function RAPIDEZ() {

        if(puntajeIncremento + 10 === puntaje){
            puntajeIncremento = puntaje;
            velocidadPinchos++;
            tiempo >= 100 ? tiempo -= 100 : tiempo = tiempo / 2;
            //Update speed of existing blocks
            pinchos.forEach(block => {
                block.slideSpeed = velocidadPinchos;
            });
            console.log("Speed increased");
        }
}


let animacion = null;
function animar() {
    animacion = requestAnimationFrame(animar);
    ctx.clearRect(0,0,canvas.width,canvas.height);
 
    CONSTRUIRsuelo();
    

    jugador.CONSTRUIR();


    RAPIDEZ();

    pinchos.forEach((arrayBlock, index) => {
        arrayBlock.slide();

        if(COLISION(jugador, arrayBlock)){
            cardpuntaje.textContent = puntaje;
            card.style.display = "block";
            cancelAnimationFrame(animacion);
        }
      
        if(MARCAPUNTO(jugador, arrayBlock) && canpuntaje){
            canpuntaje = false;
            puntajeSFX.currentTime = 0;
            puntaje++;
            
        }

 
        if((arrayBlock.x + arrayBlock.size) <= 0){
            setTimeout(() => {
                pinchos.splice(index, 1);
            }, 0)
        }
    });
    
    
}

COMENZAR();
animar();
setTimeout(() => {
    crearBloques();
}, tiempoRandom(tiempo))



addEventListener("keydown", e => {
    if(e.code === 'Space'){
        if(!jugador.hacerSALTO){
            
            jugador.SALTOcontar = 0;
            jugador.hacerSALTO = true;
            canpuntaje = true;
        }
    }
});


function REINICIAR(button) {
    card.style.display = "none";
    button.blur();
    COMENZAR();
    requestAnimationFrame(animar);
}