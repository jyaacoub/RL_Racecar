const screenW = 1500;
const screenH =  840;

let FR = 100;

let raceCar;
let raceCar2;
let track;

let sensors = [];
let mag = 500;
let boundaries = [];

let origin;

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    origin = createVector(350, 230);

    raceCar = new RaceCar(0, screenH-100, 40);
    track = new Track(screenH, screenW);
    
    for (let i = 0; i < 360; i += 20) {
        sensors.push(new SensorRay(origin.x,origin.y,mag,i));
    }

    boundaries = track.boundaries;
}

function draw() {
    clear();
    renderBackground();

    let roadDim = collisionDetection(raceCar); // collision detection

    checkKeys1(raceCar);
    raceCar.applyForces();
    raceCar.display();
    // raceCar.displayPosRelativeToRoad(roadDim);

    // displayBounds();
}

// TODO:Clean up code 
function displayBounds(){
    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }

    for (let j = 0; j < sensors.length; j++) {
        let ray = sensors[j];
        ray.updateSensor(origin, boundaries);
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

function mouseDragged(event) {
    origin.x = mouseX;
    origin.y = mouseY;
}
