const screenW = 1500;
const screenH =  840;

let FR = 100;

let raceCar;
let track;

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    origin = createVector(350, 230);

    raceCar = new RaceCar(0, screenH-100, 40);
    track = new Track(screenH, screenW);

    raceCar.env_boundaries = track.boundaries;
}

function draw() {
    clear();
    renderBackground();

    checkKeys1(raceCar);
    raceCar.applyForces();
    let distances = raceCar.updateSensors();
    displayDistances(distances);

    raceCar.display();

    if (raceCar.collision()){
        raceCar.resetPos();
    }
    
}

function displayDistances(distances){
    push();
    fill('white');
    // Front 7 sensors:
    for (let i = 0; i < 7; i++) {
        const dist = Math.round(distances[i]*10)/10;
        text(dist, 300 - 100*cos((i-3)*20), 500 - i*30);
    }
    // Back three sensors:
    for (let i = 7; i < distances.length; i++) {
        const dist = Math.round(distances[i]*10)/10;
        text(dist, 300 + 100*cos((i-8)*50), 320 + (i-7)*90);
    }
    pop();
}

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
