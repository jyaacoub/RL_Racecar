const screenW = 1500;
const screenH =  840;

let FR = 10000;

let raceCar;
let track;

let spec = {};
let env;
let agent;
function start(){
    env = raceCar;

    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.01; // value function learning rate
    spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 20;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 100 // number of neurons in hidden layer

    agent = new RL.DQNAgent(env, spec);
}

let steps_per_tick = 1;
let action, state;
function draw(){
    for(var k=0; k < steps_per_tick; k++) {
        state = env.getState();
        action = agent.act(state);
        var obs = env.sampleNextState(action);
        agent.learn(obs.r);
    }
    drawAgent(obs.r);
}

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    origin = createVector(350, 230);

    raceCar = new CarAgent();
    track = new Track(screenH, screenW);

    raceCar.env_boundaries = track.boundaries;

    start();
}

function drawAgent(reward) {
    clear();
    renderBackground();
    // The agent must be rewarded for greater speeds 
    // and farther distances from the bounds here:
    let distances = raceCar.updateSensors();
    displayCarInfo(1200,350,distances, raceCar.speed_net, reward);

    raceCar.display();
}

function displayCarInfo(x,y,distances,speed, reward){
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
    text(Math.round(reward*100)/100, x-200 , y-90);
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
