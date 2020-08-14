const screenW = 1500;
const screenH =  840;

let FR = 10000;

let car;
let car_controller_env;
let track;
let reward = 0.0;

let spec = {};
let agent;
let action, state;

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    origin = createVector(350, 230);

    car = new Car();
    track = new Track(screenH, screenW);

    car.env_boundaries = track.boundaries;

    car_controller_env = new RL_controller_env(car);
    initAgent();
}

function initAgent(){
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.7; // discount factor, [0, 1)
    spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.005; // value function learning rate
    spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 5;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 600; // number of neurons in hidden layer

    agent = new Agent(car_controller_env, spec, 'rl');
    agent.loadAgent('trainedAgent.json');
}

// This function is called every frame:
function draw(){
    if (frameCount % 1 === 0){ // Choosing how often the agent learns
        state = car_controller_env.getState();
        action = agent.network.act(state);

        // Executing the action and getting the reward value:
        var obs = car_controller_env.sampleNextState(action);

        agent.network.learn(obs.r);
        reward = obs.r;
    }

    drawAgent(); // comment this out if you don't want it to be visualized.
}

function drawAgent() {
    clear();
    // Background:
    background(0,20,0);
    track.display();

    // Agents and stats:
    displayCarInfo(1200,350, car.updateSensors(), 
                            car.speed_net, reward);
    car.display();
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
    for (let i = distances.length-1; i >= 7; i--) {
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

document.getElementById("save_agent").onclick = function (){
    console.log('Saving current agent...');
    agent.saveAgent();
}
