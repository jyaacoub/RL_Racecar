const screenW = 1500;
const screenH =  840;

let FR = 100;

let size = 50;

let gravity = 9.8;
let K_friction = 0.1;

let raceCar = new RaceCar(0, screenH-75, 40);
let raceCar2 = new RaceCar(0, screenH-125, 40);
let track = new Track(screenH, screenW);

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    raceCar2.carBody = 'blue';
    }

function draw() {
    clear();
    renderBackground();

    push();
    checkKeys1(raceCar);
    raceCar.applyForces();
    raceCar.display();

    pop();
    push();
    checkKeys2(raceCar2);
    raceCar2.applyForces();
    raceCar2.display();
}

function renderBackground(){
    background(0,40,0);
    track.display();
}

function checkKeys1(car){
    if (keyIsDown(LEFT_ARROW)) {
        car.rotation -= car.rotationSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        car.rotation += car.rotationSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        car.F_appE_x = -car.F_appE * cos(car.rotation);
        car.F_appE_y = -car.F_appE * sin(car.rotation);
    }
    if (keyIsDown(DOWN_ARROW)) {
        car.F_appE_x = car.F_appE * cos(car.rotation);
        car.F_appE_y = car.F_appE * sin(car.rotation);
    }
}

function checkKeys2(car){
    if (keyIsDown(65)) {
        car.rotation -= car.rotationSpeed;
    }
    if (keyIsDown(68)) {
        car.rotation += car.rotationSpeed;
    }
    if (keyIsDown(87)) {
        car.F_appE_x = -car.F_appE * cos(car.rotation);
        car.F_appE_y = -car.F_appE * sin(car.rotation);
    }
    if (keyIsDown(83)) {
        car.F_appE_x = car.F_appE * cos(car.rotation);
        car.F_appE_y = car.F_appE * sin(car.rotation);
    }
}
