import car from './vehicles.js';

class GA_car extends car{
    constructor(pos_x, pos_y, carSize, mass, engine_power, rotationSpeed, 
        K_friction, gravity, frameRate){
        super(pos_x, pos_y, carSize, mass, engine_power, rotationSpeed, K_friction, gravity, frameRate, false, 800);

        this.num_readings = this.car.sensors.length + 1; // +1 for the speed
        this.precision = 5 // how much to round by
        this.num_states = this.precision ** this.num_readings; // for 4 readings, 5 precision -> 5^4 = 625 states

        // lazily initialize state-action table by only initializing states as we visit them
        this.genes = {};
    }
    generateStateValue(){
        let direction = Math.random()*this.rotationSpeed/2 - this.rotationSpeed; // random float between -rotspeed and +rotspeed
        let force = Math.random()*this.F_appE/2 - this.F_appE; // random float between -f_appE and F_appE

        return [direction, force];
    }
    getStateValue(){
        // getting current state
        let s = this.getState();
        let s_key = s.join('-'); // converting to string for dict key

        // TODO: check if state is in dict and return value (if not then we need to initialize it)

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
    calcFitness(){
        // Fitness is based on how many checkpoints the car has reached
        return this.checkpoint_count;
    }
}


class GA_controller_env {
    constructor(popSize){
        this.popSize = popSize || 100;
        this.generation = 0;
        this.generationTime = 1000; // # of frames to run each generation
        
        this.population = [];
        for(let i = 0; i < this.popSize; i++){
            this.population.push(new GA_car());
        }

    }
    createPopulation(){
    }

}