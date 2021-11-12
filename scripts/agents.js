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
    constructor(car, king_moves=false){
        this.car = car;

        // RL stuff:
        if (king_moves){
            // using king moves:
            this.actions = ['l', 'r', 'f', 'b', 'lf', 'lb', 'rf', 'rb', 'n']
        } else{
            this.actions = [['l', ''],['r', ''],['', 'f'],['', '']]
        }

        this.num_actions = this.actions.length;   // l,r,f,b and nothing
        this.action = 0;    //  Output on the world

        this.num_readings = this.car.sensors.length + 1; // +1 for the speed
        this.precision = 10 // how much to round by
        this.num_states = this.precision ** this.num_readings;
    }
    getNumStates(){
        return this.num_readings;
    }
    getMaxNumActions(){
        return this.num_actions;
    }
    getState(){
        // Returns the current value from each sensor and speed.
        let s = [];
        for (let i = 0; i < this.num_readings-1; i++) {
            // dividing by the max distance possible so that it is betweeen 0.0 and 1.0:
            var norm_dist = this.car.sensors[i].distance/ this.car.sens_mag;  // this distance value is updated with car.updateSensors();  
            s.push(Math.round(norm_dist*this.precision)/this.precision) // rounding to 10th decimal place     
        }
        // dividing by max speed possible -> normalized to 0-1
        var norm_speed = this.car.speed_net/this.car.speed_terminal;
        s.push(Math.round(norm_speed*this.precision)/this.precision);
        return s;
    }
    sampleNextState(a){
        // PERFORM ACTION:
        this.car.move(this.actions[a]);
        this.car.applyForces();

        // All but the last number are distance values from sensors:
        let state = this.getState();
        let r = -0.5
        // APPLY REWARDS
        if (this.car.collision()){
            r = -10.0;
            this.car.resetPos();
        } else{
            if (this.car.checkpointReached()){
                r = 5.0;
                console.log(r, state);
            }
        }

        // Return the current state and the reward for the action for this new state
        let ns = state;
        let out = {'ns':ns, 'r':r};
        return out;
    }
}
