class Agent {
    constructor(env, spec, brain){
        this.env = env;
        this.spec = spec;

        this.brain = brain; // the RL model to train
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
            this.actions = [['l', ''],['r', ''],['', 'f'],['', 'b']]
        }

        this.num_actions = this.actions.length;   // l,r,f,b and nothing
        this.action = 0;    //  Output on the world

        this.num_readings = this.car.sensors.length + 1; // +1 for the speed
        this.precision = 4 // how much to round by
        this.num_states = this.precision ** this.num_readings;
    }
    allowedActions(){
        // returns a list of index positions for each of the possible actions.
        return [...Array(this.num_actions).keys()];
    }
    getNumStates(){
        console.log(this.num_states)
        return this.num_states;
    }
    getMaxNumActions(){
        return this.num_actions;
    }
    getState(return_index){
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

        // need to convert the state s -> a number in the list!
        if (return_index){
            // this is important in order to access the correct state-value during updates
            // Using the precision we can map to the proper index value
            // state values will be between 0 and 1
            // to get an index from that we need to appropriately map a float to an index position
            // e.g.: if precision is 10:
            // 0 -> 0
            // 0.1 -> 1
            // 0.2 -> 2
            // ...
            // 0.9 -> 9
            // 1.0 -> 10

            // if precision is 5:
            // 0 -> 0
            // 0.2 -> 1
            // 0.4 -> 2
            // 0.6 -> 3
            // 0.8 -> 4
            // 1.0 -> 5

            // we also need to combine this across multiple dimensions/readings:
            // so if we have 2 readings (a,b):
            //      [a + b] wont work.
            // width = num_states
            //      [width*a + b] does work
            
            // for 3 readings (a,b,c)
            // width = num_states
            // height/depth = num_actions (3)
            //  [width*a + depth*b + c] doesn't work...
            //  [width*(a*depth + b) + c] does!

            // for 4 readings (a,b,c,d):
            // shape = (dim_1, dim_2, dim_3, dim_4)
            // flattened = (dim_1*dim_2*dim_3*dim_4)
            //      [dim_1*(dim_2*(dim_3*a + b) + c) + d]


            // for n readings (a,b,c,...,n)
            // nD_shape = (dim_1, dim_2,...,dim_n)
            // flattened_shape = dim_1*dim_2*...*dim_n
            //      [dim_1*(dim_2* ... dim_n-1*(dim_n*a + b) + c) ... + n-1 ) + n]

            // in this case the dimensions are the same for all states:
            // e.g: if we had 4 dims with p = this.precision:
            //      [p*(p*(p*a + b) + c) + d]
            //      =[a*p^3 + b*p^2 + c*p + d]
            //
            // But we could just as well reverse this because order is irrelevent:
            //      =[a + b*p + c*p^2 + d*p^3]

            var index = 0;
            for (let i = 0; i < s.length; i++){
                var new_s = int(s[i]*this.precision); // need to do this before mapping
                index += new_s*(this.precision**i)
            }
            return index;
        }

        return s;
    }
    sampleNextState(a){
        // console.log(this.car);
        // PERFORM ACTION:
        this.car.move(this.actions[a][0], this.actions[a][1]);
        this.car.applyForces();

        // All but the last number are distance values from sensors:
        let state = this.getState(true);
        let r = -0.5
        // APPLY REWARDS
        if (this.car.collision()){
            r = -10.0;
            this.car.resetPos();
        } else{
            if (this.car.checkpointReached()){
                r = 5.0;
            }
        }

        // Return the current state and the reward for the action for this new state
        let ns = state;
        let out = {'ns':ns, 'r':r};
        return out;
    }
}
