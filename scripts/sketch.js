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
    displayCarInfo(300,500,distances, raceCar.speed_net);

    raceCar.display();

    if (raceCar.collision()){
        raceCar.resetPos();
    }
    
}

function displayCarInfo(x,y,distances,speed){
    push();
    fill(0,255,0);
    // Front 7 sensors:
    for (let i = 0; i < 7; i++) {
        const dist = Math.round(distances[i]*10)/10;
        if (dist < 10){
            fill('white');
        } else if (dist < 30){
            fill(255,0,0);
        } else if (dist < 60){
            fill('yellow');
        } else{
            fill(0,255,0);
        }
        text(dist, x - 100*cos((i-3)*20), y - i*30);
    }
    // Back three sensors:
    for (let i = 7; i < distances.length; i++) {
        const dist = Math.round(distances[i]*10)/10;
        if (dist < 10){
            fill('white');
        } else if (dist < 30){
            fill(255,0,0);
        } else if (dist < 60){
            fill('yellow');
        } else{
            fill(0,255,0);
        }
        text(dist, x + 100*cos((i-8)*50), y - (i-7)*90);
    }

    // Car speed:
    fill('white');
    text(Math.round(speed*10)/10, x+10, y-90);
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
    background(0,20,0);
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
