const screenW = 1500;
const screenH =  840;

// let FR = 10000;
// Drawing variables
let drawing = false;
let mapMode = true;

// holds all the boundaries and checkpoints and their variables.
let map = new Map();

// boundaries (walls)
let last_point_b;
let prev_num_boundaries = 0;

// checkpoints:
let last_point_c;
let curr_Checkpoint = 0; // The index pos of the current/next checkpoint.

// car and env:
let car;
let car_controller_env;
let reward = 0.0;

// Agent stuff
let spec = {};
let agent;
let action, state;

// frame speed:
var startDate = new Date();
var DISPLAY_ON = true;

function setup() {
    createCanvas(windowWidth, windowHeight-document.getElementById('header').offsetHeight-4);

    angleMode(DEGREES);
    rectMode(CENTER); // From where rectangles are drawn from

    map.loadMap('Map_2.json');
    initAgent();
}

// The exploration-exploitation dilemma is solved with epsilon that balances the two by chosing between them randomly.
//      This is called an Epsilon-Greedy policy.
//      The actual epsilon value refers to the probability of choosing to explore.
function initAgent(){
    car = new Car(0,0,30);
    car.map = map;
    car_controller_env = new RL_controller_env(car);

    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.75; // discount factor, [0, 1)
    spec.epsilon = 0.1; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.1; // value function learning rate

    // specs for normal Q-learning
    spec.smooth_policy_update = false;
    spec.beta = 0.01; // learning rate for policy, if smooth updates are on

    // eligibility traces
    spec.lambda = 4
    spec.replacing_traces = true;

    // optional optimistic initial values
    spec.q_init_val = 0;
    spec.planN = 0;

    // specs for DQN
    // spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
    // spec.experience_size = 5000; // size of experience replay memory
    // spec.learning_steps_per_iteration = 40; // how many steps to learn from when sampling experience from replay
    // spec.tderror_clamp = 1.0; // for robustness
    // spec.num_hidden_units = 500; // number of neurons in hidden layer

    brain = new RL.TDAgent(car_controller_env, spec);

    agent = new Agent(car_controller_env, spec, brain);
    // agent.loadAgent('trainedAgentV2_2_2.json');
}

// This function is called every frame (by P5.js):
function draw(){
    if (DISPLAY_ON){   
        clear();
        // Background:
        background(0,20,0);

        // displaying the track
        for (let i = 0; i < map.boundaries.length; i++) {
            map.boundaries[i].show();
        }

        // displaying checkpoints:
        for (let i = 0; i < map.checkpoints.length; i++) {
            if (car.next_Checkpoint_i === i){
                map.checkpoints[i].color = 'yellow';
            } else {
                map.checkpoints[i].color = 'green';
            }
            map.checkpoints[i].show();
        }
        
        let distances = car.updateSensors();
        displayStats(car_controller_env.getState());
        car.display();
    }
    
    learnAndAct(); // agent is getting information every frame

    if (drawing){
        drawingProgress();
    } else{
        // checkKeys1(car);
        // car.applyForces();
        // car.checkpointReached();
        // if (car.collision()){
        //     car.resetPos();
        // }
    }
}
function drawingProgress(){ // makes it easier to see what you have drawn so far.
    if (mapMode){
        if (last_point_b){
            push();
            stroke('red');
            line(last_point_b.x, last_point_b.y, mouseX, mouseY);
            if (map.boundaries.length > prev_num_boundaries + 1){
                stroke('yellow');
                line(last_point_b.x, last_point_b.y, map.boundaries[prev_num_boundaries].a.x, map.boundaries[prev_num_boundaries].a.y);
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
    state = car_controller_env.getState(true); // true to return index value
    action = agent.brain.act(state);

    // Executing the action and getting the reward value:
    var obs = car_controller_env.sampleNextState(action);
    agent.brain.learn(obs.r); 
    reward = obs.r;
}

function displayStats(data) {
    // Agent and stats:
    displayCarInfo(1150,400, data.slice(0,data.length-1), data[data.length-1]);
    displayAgentInfo(200,250, agent);
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

function displayCarInfo(x,y,distances,speed){
    push();
    fill(0,255,0);
    textSize(20);
    const sigfig = 1000;
    // Front 3 sensors:
    for (let i = 0; i < 3; i++) {
        const dist = Math.round(distances[i]*sigfig)/sigfig;
        if (dist < 0.2){
            fill('white');
        } else if (dist < 0.4){
            fill(255,0,0);
        } else if (dist < 0.6){
            fill('yellow');
        } else{
            fill(0,255,0);
        }
        text(dist, x + 100*cos((i-3)*90), y - i*90);
    }

    // Back 2 sensors:
    for (let i = 3; i < 5; i++) {
        const dist = Math.round(distances[i]*sigfig)/sigfig;
        if (dist < 0.2){
            fill('white');
        } else if (dist < 0.4){
            fill(255,0,0); // red
        } else if (dist < 0.6){
            fill('yellow');
        } else{
            fill(0,255,0); // green
        }
        text(dist, x + 100, y - (i-2.5)*90);
    }

    // Car speed:
    fill('white');
    text(Math.round(speed*sigfig)/sigfig, x+10, y-90);
    pop();
}

function keyPressed(){
    if (drawing){
        if (keyIsDown(77)) { // 'M'
            mapMode = true;
        } 
        if (keyIsDown(67)) { // 'C'
            mapMode = false;
        }
    } else {
        // TODO: add key presses for user's vehicle here.
    }
}

function mouseReleased(){
    if (drawing){
        if (mapMode){
            if (last_point_b){
                map.boundaries.push(new Boundary(last_point_b.x, last_point_b.y, mouseX, mouseY));
            }
            last_point_b = createVector(mouseX, mouseY);

        } else { // adding checkpoints instead
            if (last_point_c){
                map.checkpoints.push(new Boundary(last_point_c.x, last_point_c.y, mouseX, mouseY, 'green', 5));
                last_point_c = undefined;                
            } else{
                last_point_c = createVector(mouseX, mouseY);
            }
        }
    }
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
        this.style = "background-color: lightgreen";

        const num_boundaries = map.boundaries.length;
        // If we add new boundaries delete the last one 
        if (prev_num_boundaries !== num_boundaries){
            map.boundaries.pop();

            // Adding a final boundary to complete the track:
            const first = map.boundaries[prev_num_boundaries].a;
            const last = map.boundaries[num_boundaries-2].b;
            map.boundaries.push(new Boundary(last.x, last.y, first.x, first.y));

        }

        // reseting the values for the next drawing:
        prev_num_boundaries = num_boundaries;
        last_point_b = undefined;
        last_point_c = undefined;
    }
    
}

document.getElementById("save_agent").onclick = function (){
    console.log('Saving current agent...');
    agent.saveAgent();
}

document.getElementById("save_map").onclick = function (){
    console.log('saving map as json'); // saves the map and its checkpoints as a json.

    // Downloading that map json:
    map.saveMap();
}

document.getElementById("display_on_off").onclick = function(){
    DISPLAY_ON = ! DISPLAY_ON;
}

function checkKeys1(car){
    let direction = '';
    let force = '';
    // Turning
    if (keyIsDown(LEFT_ARROW)) {
        direction = 'l';
    }
    if (keyIsDown(RIGHT_ARROW)) {
        direction = (direction) ? '' : 'r';
    }

    // Moving
    if (keyIsDown(UP_ARROW)) {
        force = 'f';
    }
    if (keyIsDown(DOWN_ARROW)) {
        force = (force) ? '' : 'b';
    }
    car.move(direction, force);
}