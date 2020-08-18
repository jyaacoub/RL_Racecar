class Car {
    constructor(pos_x, pos_y, carSize, mass, engine_power, rotationSpeed, 
                K_friction, gravity, frameRate){
        this.carSize = carSize || 40;
        this.mass = mass || 10000;

        this.pos_x = pos_x || 750; // Chosen to be the center of the screen
        this.pos_y = pos_y || 740;
        this.original_pos = createVector(this.pos_x, this.pos_y);

        this.rotationSpeed = rotationSpeed || 2;

        this.K_friction = K_friction || 0.1;
        this.gravity = gravity || 9.8;
        this.delta_t = 1/frameRate || 1/100;

        this.carSizeW = this.carSize;
        this.carSizeH = this.carSize/2;

        this.F_friction = this.K_friction * this.mass * this.gravity;
        
        let engine_p = engine_power || 430; 
        this.F_appE = engine_p * this.mass;
        this.F_appE_x = 0;
        this.F_appE_y = 0;

        this.speed_x = 0;
        this.speed_y = 0;
        this.speed_net = 0;
        this.speed_terminal = this.F_appE/(this.F_friction); // max speed due to drag

        this.rotation = 0;
        this.carBody = 'green';

        this.sensors = [];
        this.sens_mag = 400;

        // These are what are displayed on the screen:
        // Front sensors:
        for (let i = -60; i <= 60; i += 20) {
            this.sensors.push(new SensorRay(this.pos_x,this.pos_y,this.sens_mag,i));
        }
        // Back sensors:
        for (let i = 120; i < 270; i += 40) {
            this.sensors.push(new SensorRay(this.pos_x,this.pos_y,this.sens_mag,i));
        }

        // Not displayed sensors:
        for (let i = 100; i <= 260; i += 40){
            this.sensors.push(new SensorRay(this.pos_x,this.pos_y,this.sens_mag,i,0,0,'lightBlue'));
        }

        this.env_boundaries = []; // Set externally
    }
    displaySensors(){
        for (let j = 0; j < this.sensors.length; j++) {
            this.sensors[j].show();
        }
    }
    updateSensors(){
        // updates the sensors and returns a list of their distances
        let distances = [];
        for (let j = 0; j < this.sensors.length; j++) {
            let sensor = this.sensors[j];
            let origin = createVector(this.pos_x, this.pos_y);
            
            sensor.changeDirection(this.rotation);
            sensor.updateSensor(origin, this.env_boundaries);
            distances.push(sensor.distance);
        }
        return distances;
    }
    display(){
        this.displaySensors();  
        push();
        translate(this.pos_x, this.pos_y);
        rotate(this.rotation);

        noStroke();
        const w = this.carSizeW;
        const h = this.carSizeH;
        const size = this.carSize;

        // Drawing body and shape
        fill('dark' + this.carBody);
        rect(0, 0, w, h, 10);
    
        fill(80);
        rect(0,0, w*0.5, h*0.6, 10);
        
        fill('red');
        circle(w*(46/100), h/4, size/13);
        circle(w*(46/100), -h/4, size/13);
    
        fill('white');
        circle(-w*(44/100), h/4, size/10);
        circle(-w*(44/100), -h/4, size/10);
        pop();    
    }
    applyForces(){
        // Friction magnitudes
        let F_friction_x = -this.speed_x * this.F_friction;
        let F_friction_y = -this.speed_y * this.F_friction;
    
        // Calc. net force
        let F_net_x = F_friction_x + this.F_appE_x;
        let F_net_y = F_friction_y + this.F_appE_y;
    
        // Calc. acceleration by dividing net force by mass
        let accel_x = F_net_x / this.mass;
        let accel_y = F_net_y / this.mass;
    
        // Delta time is seconds per frame
        this.speed_x += accel_x * this.delta_t;     // units are: pixels/second
        this.speed_y += accel_y * this.delta_t;
        this.speed_net = sqrt(this.speed_x**2 + this.speed_y**2);
        
        // Applying mechanics formula
        this.pos_x += this.speed_x * this.delta_t + 0.5 * accel_x * (this.delta_t**2);
        this.pos_y += this.speed_y * this.delta_t + 0.5 * accel_y * (this.delta_t**2);
        
        // Reseting the forces for the next frame
        this.F_appE_x = 0;
        this.F_appE_y = 0;
    }
    move(direction){
        // Turning:
        if (direction === 'l'){ // Left
            this.rotation -= this.rotationSpeed;
        } else if (direction === 'r'){ // Right
            this.rotation += this.rotationSpeed;

        // Moving:
        } else if (direction === 'f'){ // Forwards
            this.F_appE_x = -this.F_appE * cos(this.rotation);
            this.F_appE_y = -this.F_appE * sin(this.rotation);
        } else if (direction === 'b'){ // Backwards
            this.F_appE_x = this.F_appE * cos(this.rotation);
            this.F_appE_y = this.F_appE * sin(this.rotation);
        }
    }
    resetPos(){
        this.rotation = 0;
        // Position reset
        this.pos_x = this.original_pos.x;
        this.pos_y = this.original_pos.y;
        
        // Speed
        this.speed_x = 0;
        this.speed_y = 0;
        
        // Forces
        this.F_appE_x = 0;
        this.F_appE_y = 0;
    }
    collision(){
        for (let i = 0; i < this.sensors.length; i++) {
            const dist = this.sensors[i].distance;
            if (dist <= 5.0){
                return true;
            }
        }
        return false;
    }
}
