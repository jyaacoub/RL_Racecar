const screenW = 1500;
const screenH =  840;

// let FR = 10000;
// Drawing variables
let drawing = false;
let mapMode = true;

// boundaries (walls)
let last_point_b;
let prev_num_boundaries = 0;
let boundaries = [];    // Holds all the boundaries that the car can collide into.

// checkpoints:
let last_point_c;
let curr_Checkpoint = 0; // The index pos of the current/next checkpoint.
let checkpoints = [];   // Holds all the checkpoints that the car gains rewards for when passing.

// car and env:
let car;
let car_controller_env;
let reward = 0.0;

// Agent stuff
let spec = {};
let agent;
let action, state;

function setup() {
    createCanvas(windowWidth, windowHeight-document.getElementById('header').offsetHeight-4);
    // frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER); // From where rectangles are drawn from

    car = new Car(0,0,30);
    car.env_boundaries = boundaries;
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
    clear();
    // Background:
    background(0,20,0);

    // displaying the track
    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }

    // displaying checkpoints:
    for (let i = 0; i < checkpoints.length; i++) {
        checkpoints[i].show();
    }
    
    let distances = car.updateSensors();
    displayStats(distances);
    car.display();

    if (drawing){
        drawEnvironment();

    } else{
        if (frameCount % 1 === 0){ // Agent is getting information every n frames
            // learnAndAct();
        }
        
        checkKeys2(car);
        car.applyForces();
    }
}
function drawEnvironment(){
    if (mapMode){
        if (last_point_b){
            push();
            stroke('red');
            line(last_point_b.x, last_point_b.y, mouseX, mouseY);
            if (boundaries.length > prev_num_boundaries + 1){
                stroke('yellow');
                line(last_point_b.x, last_point_b.y, boundaries[prev_num_boundaries].a.x, boundaries[prev_num_boundaries].a.y);
                console.log(prev_num_boundaries);
            }
            pop();
        }
    }else{ // Checkpoint mode:
        if (last_point_c){
            push();
            stroke('red');
            strokeWeight(5);
            line(last_point_c.x, last_point_c.y, mouseX, mouseY);
            pop();
        }
    }
}
function learnAndAct(){
    state = car_controller_env.getState();
    action = agent.brain.act(state);

    // Executing the action and getting the reward value:
    var obs = car_controller_env.sampleNextState(action, reward);
    agent.brain.learn(obs.r); // TODO: calculate collision rewards externally
    reward = obs.r;
}

function displayStats(distances) {
    // Agent and stats:
    displayCarInfo(1180,380, distances, car.speed_net, reward);
    displayAgentInfo(200,200, agent);
}
function displayAgentInfo(x,y, agent){
    // Displays information about the agent (spec.)
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

function keyPressed(){
    if (drawing){
        if (keyIsDown(77)) { // 'M'
            mapMode = true;
        } 
        if (keyIsDown(67)) { // 'C'
            mapMode = false;
        }
    }
}

function mouseReleased(){
    if (drawing){
        if (mapMode){
            if (last_point_b){
                boundaries.push(new Boundary(last_point_b.x, last_point_b.y, mouseX, mouseY));
            }
            last_point_b = createVector(mouseX, mouseY);

        } else { // adding checkpoints instead
            if (last_point_c){
                checkpoints.push(new Boundary(last_point_c.x, last_point_c.y, mouseX, mouseY, 'green', 5));
                last_point_c = undefined;                
            } else{
                last_point_c = createVector(mouseX, mouseY);
            }

        }
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
document.getElementById("toggle_draw").onclick = function (){
    console.log('draw togg');
    drawing = !drawing;
    if (drawing){
        this.innerHTML = "Stop Drawing";
        this.style = "background-color: red";
    } else{
        this.innerHTML = "Start Drawing";
        this.style = "background-color: green";

        const num_boundaries = boundaries.length;
        // If we add new boundaries delete the last one 
        if (prev_num_boundaries !== num_boundaries){
            boundaries.pop();

            // Adding a final boundary to complete the track:
            const first = boundaries[prev_num_boundaries].a;
            const last = boundaries[num_boundaries-2].b;
            boundaries.push(new Boundary(last.x, last.y, first.x, first.y));

        }

        // reseting the values for the next drawing:
        prev_num_boundaries = num_boundaries;
        last_point_b = undefined;
        last_point_c = undefined;
    }
    
}

document.getElementById("save_map").onclick = function (){
    console.log('saving map as json');
    // TODO: this...
}

// TODO: add checkpoints for the vehicle to gain rewards as it goes around.