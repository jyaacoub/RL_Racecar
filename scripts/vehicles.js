class Car {
    constructor(pos_x, pos_y, carSize, mass, engine_power, rotationSpeed, 
                K_friction, gravity, frameRate){
        this.carSize = carSize || 40;
        this.mass = mass || 10000;

        this.pos_x = pos_x || 300;
        this.pos_y = pos_y || 740;
        this.reset_pos = createVector(this.pos_x, this.pos_y);

        this.rotationSpeed = rotationSpeed || 2;

        this.K_friction = K_friction || 0.1;
        this.gravity = gravity || 9.8;
        this.delta_t = 1/frameRate || 1/100;

        this.carSizeW = this.carSize;
        this.carSizeH = this.carSize/2;

        this.F_friction = this.K_friction * this.mass * this.gravity;
        
        let engine_p = engine_power || 1000; 
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
        // 3 Front sensors:
        for (let i = -45; i <= 45; i += 45) {
            this.sensors.push(new SensorRay(this.pos_x,this.pos_y,this.sens_mag,i));
        }
        // 2 Back sensors:
        for (let i = 150; i <= 210; i += 60) {
            this.sensors.push(new SensorRay(this.pos_x,this.pos_y,this.sens_mag,i));
        }

        this.map; // Set externally
        this.next_Checkpoint_i = 0; // index of next checkpoint
    }
    updateSensors(){
        // updates the sensors and returns a list of their distances
        let distances = [];
        for (let j = 0; j < this.sensors.length; j++) {
            let sensor = this.sensors[j];
            let origin = createVector(this.pos_x, this.pos_y);
            
            sensor.changeDirection(this.rotation);
            sensor.updateSensor(origin, this.map.boundaries);
            distances.push(sensor.distance);
        }
        return distances;
    }
    displaySensors(){
        for (let j = 0; j < this.sensors.length; j++) {
            this.sensors[j].show();
        }
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
    applyForces(frame_skip){
        var loop = (frame_skip) ? frame_skip: 0;

        for (var x = 0; x <= loop; x++){ // hacky way to apply frame skipping
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
    }
    move(direction, force){
        // Turning:
        if (direction === 'l'){ // Left
            this.rotation -= this.rotationSpeed;
        } else if (direction === 'r'){ // Right
            this.rotation += this.rotationSpeed;

        // Moving:
        } if (force === 'f'){ // Forwards
            this.F_appE_x = -this.F_appE * cos(this.rotation);
            this.F_appE_y = -this.F_appE * sin(this.rotation);
        } else if (force === 'b'){ // Backwards
            this.F_appE_x = this.F_appE * cos(this.rotation);
            this.F_appE_y = this.F_appE * sin(this.rotation);
        }
    }
    resetPos(){
        this.rotation = 0;
        // Position reset
        this.pos_x = this.reset_pos.x;
        this.pos_y = this.reset_pos.y;
        
        // Speed
        this.speed_x = 0;
        this.speed_y = 0;
        
        // Forces
        this.F_appE_x = 0;
        this.F_appE_y = 0;

        this.next_Checkpoint_i = 0;
    }
    checkpointReached(update_checkpoint=true){
        const colliders = this.colliders;
        const next_checkpoint = this.map.checkpoints[this.next_Checkpoint_i];

        if (next_checkpoint === undefined){
            return false;
        }

        for (let i = 0; i < colliders.length; i++) {
            const collider = colliders[i];
            if (collider.collision(next_checkpoint)){
                console.log('checkpoint REACHED');
                if (update_checkpoint){
                    this.next_Checkpoint_i += 1;
                    if (this.next_Checkpoint_i === this.map.checkpoints.length) this.next_Checkpoint_i = 0;
                }
                return true;
            }
        }
    }
    collision(lines){
        const colliders = this.colliders;
        const boundaries = lines || this.map.boundaries;

        for (let i = 0; i < colliders.length; i++) {
            const collider = colliders[i];

            for (let j = 0; j < boundaries.length; j++) {
                const boundary = boundaries[j];

                if (collider.collision(boundary)){
                    return true;
                }
            }
        }
        return false;
    }
    get colliders(){
        // Creating a square border box.
        const boxSize = this.carSize*0.2;
        const h = boxSize*sqrt(2); // hypotenuse of the triangle made from the center point to a point of the box.

        // To improve rendering:
        const h_posCos = h*cos(45 + this.rotation);
        const h_negCos = h*cos(45 - this.rotation);
        const h_posSin = h*sin(45 + this.rotation);
        const h_negSin = h*sin(45 - this.rotation);

        const point_LT = createVector(this.pos_x - h_posCos, this.pos_y - h_posSin);
        const point_RT = createVector(this.pos_x + h_negCos, this.pos_y - h_negSin);
        const point_RB = createVector(this.pos_x + h_posCos, this.pos_y + h_posSin);
        const point_LB = createVector(this.pos_x - h_negCos, this.pos_y + h_negSin);

        let colliders = [];
        colliders.push(new Collider(point_LT.x, point_LT.y, point_RT.x, point_RT.y));
        colliders.push(new Collider(point_RT.x, point_RT.y, point_RB.x, point_RB.y));
        colliders.push(new Collider(point_RB.x, point_RB.y, point_LB.x, point_LB.y));
        colliders.push(new Collider(point_LB.x, point_LB.y, point_LT.x, point_LT.y));

        return colliders; // With this we can call collider.collision(boundary) to determine if a collision occurs with the car
    }
}