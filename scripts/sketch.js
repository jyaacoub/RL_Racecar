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
    rectMode(CENTER); // From where rectangles are drawn from

    origin = createVector(350, 230);

    car = new Car();
    track = new Track(screenH, screenW);

    car.env_boundaries = track.boundaries;

    car_controller_env = new RL_controller_env(car);
    initAgent();
}

// The exploration-exploitation dilemma is solved with epsilon that balances the two by chosing between them randomly.
//      This is called an Epsilon-Greedy policy.
//      The actual epsilon value refers to the probability of choosing to explore.
function initAgent(){
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.5; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.005; // value function learning rate
    spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
    spec.experience_size = 1000; // size of experience replay memory
    spec.learning_steps_per_iteration = 5;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 100; // number of neurons in hidden layer

    agent = new Agent(car_controller_env, spec, 'rl');
    // agent.loadAgent('trainedAgent.json');
}

// This function is called every frame (by P5.js):
function draw(){
    if (frameCount % 1 === 0){ // Agent is getting information every n frames
        state = car_controller_env.getState();
        action = agent.brain.act(state);

        // Executing the action and getting the reward value:
        var obs = car_controller_env.sampleNextState(action);
        agent.brain.learn(obs.r);
        reward = obs.r;
    }

    drawAgent(); // comment this out if you don't want it to be visualized.
    checkKeys2(car);
    // car.applyForces();
    
}

function drawAgent() {
    clear();
    // Background:
    background(0,20,0);
    track.display();

    // Agent and stats:
    displayCarInfo(1180,380, car.updateSensors(), 
                            car.speed_net, reward);
    displayAgentInfo(200,200, agent);
    car.display();
}
function displayAgentInfo(x,y, agent){
    push();
    fill('white');
    textSize(20);
    let currY = 0;

    let spec = agent.spec;
    for (const key in spec) {
        if (spec.hasOwnProperty(key)) {
            const val = spec[key];
            text(key + ':\t\t' + str(val), x, y + currY);
            currY += 25;
        }
    }
    pop();
}
function displayCarInfo(x,y,distances,speed, reward){
    push();
    fill(0,255,0);
    textSize(20);
    const spacing = 50;
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
    for (let i = 7; i <= 10; i++) {
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
        text(dist, x + 100*cos((i-8.5)*40), y - (abs(i-10))*60);
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

document.getElementById("update_epsilon").onclick = function (){
    console.log('Updating epsilon...');

    const inputEpsilon = document.getElementById("epsilon_input").value;
    console.log(float(inputEpsilon));

    const prevEnv = agent.env;
    let newSpec = agent.spec;
    newSpec.epsilon = float(inputEpsilon);
    let prevNetwork = agent.brain.toJSON();
    
    agent.brain = new RL.DQNAgent(prevEnv, newSpec);
    agent.brain.fromJSON(prevNetwork);
    
}
