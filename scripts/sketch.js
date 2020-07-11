const screenW = 1500;
const screenH =  840;

let FR = 100;
let delta_t = 1/FR;
let carSize = 100;
let carSizeW = 100;
let carSizeH = 50;
let pos_x = screenW/2;
let pos_y = screenH/2;

let rotation = 0;
let rotationSpeed = 3;
let translationSpeed = 5;

let CarMass = 10000; // In Kg
let gravity = 9.8;
let K_friction = 0.5;

let F_friction = K_friction * (CarMass*gravity);
let F_friction_x = 0;
let F_friction_y = 0;

let F_app = 200*CarMass;  // By the car's engine moving it forward
let F_app_x = 0;
let F_app_y = 0;

let F_net_x = 0;
let F_net_y = 0;

let speed_x = 0;
let speed_y = 0;
let motionDirection = 0; // Angle relative to east

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);
}

function draw() {
    clear();
    checkKeys();
    applyForces();
    renderCar();
}

function applyForces(){
    F_net_x = F_friction_x + F_app_x;
    F_net_y = F_friction_y + F_app_y;

    accel_x = F_net_x / CarMass;
    accel_y = F_net_y / CarMass;

    speed_x += accel_x * delta_t;
    speed_y += accel_y * delta_t;

    pos_x += speed_x * delta_t + 0.5 * accel_x * (delta_t**2);
    pos_y += speed_y * delta_t + 0.5 * accel_y * (delta_t**2);
    console.log(pos_x);

    F_app_x = 0;
    F_app_y = 0;
}

function renderCar(){
    translate(pos_x, pos_y);
    rotate(rotation);
    fill('green');
    rect(0, 0, carSizeW, carSizeH);
    
    fill('red');
    circle(carSizeW*(49/100), carSizeH/4, 7);
    circle(carSizeW*(49/100), -carSizeH/4, 7);

    fill('white');
    circle(-carSizeW*(49/100), carSizeH/4, 13);
    circle(-carSizeW*(49/100), -carSizeH/4, 13);
}

function checkKeys(){
    if (keyIsDown(LEFT_ARROW)) {
        rotation -= 2*rotationSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        rotation += 2*rotationSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        F_app_x = -F_app * cos(rotation);
        F_app_y = -F_app * sin(rotation);
    }
    if (keyIsDown(DOWN_ARROW)) {
        F_app_x = F_app * cos(rotation);
        F_app_y = F_app * sin(rotation);
    }
}
