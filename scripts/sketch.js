const screenW = 1500;
const screenH =  840;

let FR = 100;
let delta_t = 1/FR;

let carSize = 600;
let carSizeW = carSize;
let carSizeH = carSize/2;

let pos_x = screenW/2;
let pos_y = screenH/2;

let CarMass = 10000; // In Kg
let gravity = 9.8;
let K_friction = 0.1;

// Friction forces
let F_friction = K_friction * (CarMass*gravity);
let F_friction_x = 0;
let F_friction_y = 0;

// Force applied by car
let F_appE = 430*CarMass;  // By the car's engine moving it forward
let F_appE_x = 0;
let F_appE_y = 0;

let F_net_x = 0;
let F_net_y = 0;

let speed_x = 0;
let speed_y = 0;

let rotationSpeed = 2;
let rotation = 0;

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);
}

function draw() {
    clear();
    renderBackground();

    checkKeys();
    applyForces();
    renderCar();

}

function renderBackground(){
    background('grey');
}

function applyForces(){
    F_friction_x = -speed_x * F_friction;
    F_friction_y = -speed_y * F_friction;

    F_friction_net = (F_friction_x**2 + F_friction_y**2)**0.5;

    F_net_x = F_friction_x + F_appE_x;
    F_net_y = F_friction_y + F_appE_y;

    accel_x = F_net_x / CarMass;
    accel_y = F_net_y / CarMass;

    speed_x += accel_x * delta_t;
    speed_y += accel_y * delta_t;

    pos_x += speed_x * delta_t + 0.5 * accel_x * (delta_t**2);
    pos_y += speed_y * delta_t + 0.5 * accel_y * (delta_t**2);

    F_appE_x = 0;
    F_appE_y = 0;
    F_appR = 0;
}

function renderCar(){
    noStroke();
    translate(pos_x, pos_y);
    rotate(rotation);
    fill('green');
    rect(0, 0, carSizeW, carSizeH, 20);

    fill(0,200,0);
    rect(0,0, 3*carSizeW/5, 7*carSizeH/10, 20);
    
    fill('red');
    circle(carSizeW*(46/100), carSizeH/4, carSize/13);
    circle(carSizeW*(46/100), -carSizeH/4, carSize/13);

    fill('white');
    circle(-carSizeW*(44/100), carSizeH/4, carSize/10);
    circle(-carSizeW*(44/100), -carSizeH/4, carSize/10);

    // stroke(255);
    // line(0,0,10,100);
}

function checkKeys(){
    if (keyIsDown(LEFT_ARROW)) {
        rotation -= rotationSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        rotation += rotationSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        F_appE_x = -F_appE * cos(rotation);
        F_appE_y = -F_appE * sin(rotation);
    }
    if (keyIsDown(DOWN_ARROW)) {
        F_appE_x = F_appE * cos(rotation);
        F_appE_y = F_appE * sin(rotation);
    }
}
