const screenW = 1500;
const screenH =  840;

let FR = 100;

let size = 50;

let gravity = 9.8;
let K_friction = 0.1;

let raceCar;
let raceCar2;
let track;

let ray;
let dir = 180;
let boundaries = [];

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR/4);

    angleMode(DEGREES);
    rectMode(CENTER);

    raceCar = new RaceCar(0, screenH-100, 40);
    raceCar2 = new RaceCar(0, screenH-125, 40);
    track = new Track(screenH, screenW);

    ray = new Ray(200,200,100, dir);

    boundaries.push(new Boundary(500,100,500,500));
    boundaries.push(new Boundary(100,300,400,300));
    // raceCar2.carBody = 'blue';
}

function draw() {
    clear();
    background('black');
    ray.show();

    fill('white');
    textSize(30);
    text(dir, 100,100);

    displayBounds();

    // TODO: Test raycasting with various rays of differant lengths 
    //      and differant sized boundaries

    // renderBackground();

    // let roadDim = collisionDetection(raceCar); // collision detection

    // checkKeys1(raceCar);
    // raceCar.applyForces();
    // raceCar.display();
    // raceCar.displaySensors(roadDim);

    // raceCar.displayBounds();
    // // checkKeys2(raceCar2);
    // // raceCar2.applyForces();
    // // raceCar2.display();
}

function displayBounds(){
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        boundary.show();
        
    }
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
