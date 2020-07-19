const screenW = 1500;
const screenH =  840;

let FR = 100;

let size = 50;

let gravity = 9.8;
let K_friction = 0.1;

let raceCar = new RaceCar(0, screenH-100, 40);
let raceCar2 = new RaceCar(0, screenH-125, 40);
let track = new Track(screenH, screenW);

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    // raceCar2.carBody = 'blue';
    }

function draw() {
    clear();
    renderBackground();

    roadDim = collisionDetection(raceCar); // collision detection

    push();
    checkKeys1(raceCar);
    raceCar.applyForces();
    raceCar.display();
    raceCar.displaySensors(roadDim);

    pop();
    push();
    displayBounds(raceCar);

    // pop();
    // push();
    // checkKeys2(raceCar2);
    // raceCar2.applyForces();
    // raceCar2.display();
}

function displayBounds(car){
    stroke('red');
    let [l,r,t,b] = car.borders;
    strokeWeight(2);
    
    line(l,b,l,t);
    line(r,b,r,t);
    line(l,b,r,b);
    line(l,t,r,t);
}

function renderBackground(){
    background(0,40,0);
    track.display();
}

function collisionDetection(car){
    let [onTrack, roadDim] = track.onTrack(car);
    
    if (!onTrack){
        car.resetPos();
    }

    return roadDim;
}

function checkKeys1(car){
    // Turning
    if (keyIsDown(LEFT_ARROW)) {
        car.move('l');
    }
    if (keyIsDown(RIGHT_ARROW)) {
        car.move('r');
    }

    // Moving
    if (keyIsDown(UP_ARROW)) {
        car.move('f');
    }
    if (keyIsDown(DOWN_ARROW)) {
        car.move('b');
    }
}

function checkKeys2(car){
    // Turning
    if (keyIsDown(65)) { // 'A'
        car.move('l');
    }
    if (keyIsDown(68)) { // 'D'
        car.move('r');
    }

    // Moving
    if (keyIsDown(87)) { // 'W'
        car.move('f');
    }
    if (keyIsDown(83)) { // 'S'
        car.move('b');
    }
}
