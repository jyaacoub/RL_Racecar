class Agent {
    constructor(env, spec, type){
        this.env = env;
        this.spec = spec;
        this.type = type;

        if (type === 'rl'){
            this.brain = new RL.DQNAgent(env, spec);
        }
    }
    saveAgent(fileName){
        const content = JSON.stringify(this.brain.toJSON());

        // In order to save the JSON into a text file we must first create a
        // temp element to hold the data so that we can send it to the server
        let a = document.createElement("a");

        // Blob == Binary Large OBject
        // let file = new Blob([content], {type: 'text/plain'});
        a.href = "data:text/json;charset=utf-8," 
                    + encodeURIComponent(content);
        a.download = 'trainedAgent.json';
        a.click();
        a.remove();      
    }
    loadAgent(fileName){
        let filePath = '../agents/';
        if (fileName){
            filePath += fileName;
        } else {
            filePath += this.constructor.name;
            filePath += '.json'
        }

        console.log('Loading from json:', filePath);
        let brain = this.brain;

        $.getJSON(filePath, function(data){
            console.log('Success');
            brain.fromJSON(data);
        }).fail(function(){
            console.log('Failed');
        });
    }
}

class RL_controller_env {
    constructor(car){
        this.car = car;

        // RL stuff:
        this.reward = 0.0;

        this.num_actions = 5;   // l,r,f,b and nothing
        this.action = 0;    //  Output on the world

        this.num_states = this.car.sensors.length + 1; // +1 for the speed
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
            s.push(this.car.sensors[i].distance/ this.car.sens_mag);  // this distance value is updated with car.updateSensors();          
        }
        s.push(this.car.speed_net/this.car.speed_terminal);

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
        let r = 0.0
        // APPLY REWARDS
        if (this.car.collision()){
            r -= 3.0;
            this.car.resetPos();
        } else{
            // normalizing current speed val.
            // r += (state[state.length-1]/this.car.speed_terminal)*5.0;
            if (this.car.checkpointReached()){
                r += 1.0;
                console.log(r);
            }
        }

        // Return the current state and the reward for the action for this new state
        let ns = state;
        let out = {'ns':ns, 'r':r};
        return out;
    }
}
