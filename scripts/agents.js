class Agent {
    constructor(env, spec, type, fileName){
        if (type === 'rl'){
            this.network = new RL.DQNAgent(env, spec);
        }
        if (fileName){
            let j = this.loadAgent(fileName);
            if (j){
                this.network.fromJSON(j);
            }
        }
    }
    getFilePath(fileName){
        let filePath = '../agents/';
        if (fileName){
            filePath += fileName;
        } else {
            filePath += this.constructor.name;
        }
        return filePath;

    }
    saveAgent(fileName){
        const filePath = this.getFilePath(fileName);
        console.log(filePath);
        
    }
    loadAgent(fileName){
        // Gets the JSON file for this particular agent
        const filePath = this.getFilePath(fileName);
        console.log(filePath);

        // returns nothing (undef.) if the JSON file doesn't exist
    }
}

class RL_controller_env {
    constructor(car){
        this.car = car;
        // RL stuff:
        this.brain = null;  // Set externally
        this.reward = 0.0;

        this.num_actions = 5;   // l,r,f,b and nothing
        this.action = 0;    //  Output on the world

        this.num_states = this.car.sensors.length + 1; // includes speed
    }
    getNumStates(){
        return this.num_states;
    }
    getMaxNumActions(){
        return this.num_actions;
    }
    getState(){
        // Returns the value from each sensor and the current speed.
        let s = [];
        for (let i = 0; i < this.num_states-1; i++) {
            s.push(this.car.sensors[i].distance);            
        }
        s.push(this.car.speed_net);

        return s;
    }
    sampleNextState(a){
        // PERFORM ACTION:
        if (a === 0) this.car.move('l');
        if (a === 1) this.car.move('r');
        if (a === 2) this.car.move('f');
        if (a === 3) this.car.move('b');
        
        this.car.applyForces();

        // All but the last number are distance values from sensors:
        let state = this.getState();
        
        // APPLY REWARDS
        let r = 0.0;
        if (this.car.collision()){
            r -= 5.0;
            this.car.resetPos();
        }

        for (let i = 0; i < state.length-1; i++) {
            const value = state[i];
            let normal = (value)/this.car.sens_mag; // normalizing the distance value.
            r += normal*2 - 1;
        }

        // normalizing current speed val.
        r += (state[state.length-1]/this.car.speed_terminal)*5; 
        
        if (a === 2) r += 0.5; // Bonus for moving forwards
        // Return the current state and the reward for the action for this new state
        let ns = state;
        let out = {'ns':ns, 'r':r};
        return out;
    }
}

class GA_controller extends Agent {
    constructor(car){
        super(car);
    }
    decideOnAction(){
        // From the current distances it decides what action to perform next
    }
    performAction(car){
        // There are 4 differant things the model can do:
        //      Turn left, turn right, accelerate, and reverse.
    }
}
