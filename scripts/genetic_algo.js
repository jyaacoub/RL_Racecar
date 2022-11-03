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
        // generates a random state value
        let direction = Math.random()*this.rotationSpeed/2 - this.rotationSpeed; // random float between -rotspeed and +rotspeed
        let force = Math.random()*this.F_appE/2 - this.F_appE; // random float between -f_appE and F_appE

        return [direction, force];
    }
    getStateValue(){
        // getting current state
        let s = this.getState();
        let s_key = s.join('-'); // converting to string for dict key

        // check if state is in dict and return value
        if (s_key in this.genes){
            return this.genes[s_key];
        } else { // if not, generate a random value and add it to the dict
            // initialize state
            this.genes[s_key] = this.generateStateValue();
            return this.genes[s_key];
        }
    }
    getState(){
        // Returns the current value from each sensor and speed.
        let s = [];
        for (let i = 0; i < this.num_readings-1; i++) {
            // dividing by the max distance possible so that it is betweeen 0.0 and 1.0:
            var norm_dist = this.sensors[i].distance/ this.sens_mag;  // this distance value is updated with car.updateSensors();  
            s.push(Math.round(norm_dist*this.precision)/this.precision) // e.g: if precision = 10 this just rounds to 10th decimal place      
        }
        // dividing by max speed possible -> normalized to 0-1
        var norm_speed = this.speed_net/this.speed_terminal;
        s.push(Math.round(norm_speed*this.precision)/this.precision);
        return s;
    }
    getFitness(){
        // Fitness is based on how many checkpoints the car has reached
        return this.checkpoint_count;
    }
}


class GA_popluation{
    constructor(popSize=100, genTime=100){
        this.popSize = popSize;
        this.generationTime = genTime; // # of frames to run each generation
        
        this.population = [];
        for(let i = 0; i < this.popSize; i++){
            this.population.push(new GA_car());
        }
    }
    display(){
        // Displaying the population:
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].display();
        }
    }
    getTop2Fittest(){
        // Getting the top two fittest car in the population
        let fit1 = this.population[0];
        let fit2 = this.population[1];
        for (let i = 1; i < this.population.length; i++) {
            if (this.population[i].getFitness() > fit1.getFitness()){ 
                // car is fitter than the current fittest -> bump down the fittest
                fit2 = fit1;
                fit1 = this.population[i];
            } else if (this.population[i].getFitness() > fit2.getFitness()){
                // car is fitter than the current second fittest -> replace second fittest
                fit2 = this.population[i];
            }
        }
        return fit1, fit2;
    }
    getLeastFittest(){
        // Getting the least fittest car in the population
        let leastFittest = this.population[0];
        for (let i = 1; i < this.population.length; i++) {
            if (this.population[i].getFitness() < leastFittest.getFitness()){
                leastFittest = this.population[i];
            }
        }
        return leastFittest;
    }
}


class GA_controller{
    constructor(){
        this.pop = new GA_popluation(100, 100);
        this.genCount = 0;

    }
    update(){
        // Updating the population at the end of each generation
        this.genCount++;

        // Getting top 2 fittest cars
        let fit1, fit2 = this.pop.getTop2Fittest();

        // Getting least fittest car
        let leastFittest = this.pop.getLeastFittest();

        // 

    }
    crossover(){
    }
    mutate(){
    }
    replace(){

    }
}