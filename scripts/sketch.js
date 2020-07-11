const screenW = 1500;
const screenH =  840;

let FR = 300;
let carSize = 100;
let carSizeW = 100;
let carSizeH = 50;
let posX = screenW/2;
let posY = screenH/2;

let rotation = 0;
let rotationSpeed = 5;
let translationSpeed = 10;

let K_friction = 0.4;
let F_app = 0;


function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);
}

function draw() {
    clear();
    checkKeys();
    renderCar();
}

function renderCar(){
    translate(posX, posY);
    rotate(rotation);
    fill('green');
    rect(0, 0, carSizeW, carSizeH);
    
    fill('red');
    circle(carSizeW*(49/100), carSizeH/4,7,7);
    circle(carSizeW*(49/100), -carSizeH/4,7,7);

    fill('white');
    circle(-carSizeW*(49/100), carSizeH/4,13);
    circle(-carSizeW*(49/100), -carSizeH/4,13);
}

function checkKeys(){
    if (keyIsDown(LEFT_ARROW)) {
        rotation -= 2*rotationSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        rotation += 2*rotationSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        posX -= translationSpeed * cos(rotation);
        posY -= translationSpeed * sin(rotation);
        console.log(rotation, posX, posY);
    }
    if (keyIsDown(DOWN_ARROW)) {
        posX += translationSpeed * cos(rotation);
        posY += translationSpeed * sin(rotation);
    }
}
