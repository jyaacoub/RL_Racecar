class RaceCar {
    constructor(pos_x, pos_y, carSize, mass, engine_power, rotationSpeed, 
                K_friction, gravity, frameRate){
        this.carSize = carSize || 50;
        this.mass = mass || 10000;

        this.pos_x = pos_x || 750; // Chosen to be the center of the screen
        this.pos_y = pos_y || 420;
        this.original_pos = [this.pos_x, this.pos_y];

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

        this.rotation = 0;
        this.carBody = 'green';
    }
    display(){
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
    displaySensors(roadDim){
        push();
        translate(this.pos_x, this.pos_y);
        rotate(this.rotation);

        const radius = sqrt(2)*size;
        let [l,r,t,b] = roadDim || [];
        console.log(l);

        stroke('red');
        strokeWeight(0.03*size);
        
        let dist_l = l-this.pos_x;
        let dist_r = r-this.pos_x;

        let dist_t = b-this.pos_y;
        let dist_b = t-this.pos_y;
        let r_car = this.rotation;

        line(0,0,dist_t*sin(r_car), 
                dist_t*cos(r_car));
        line(0,0,dist_b*sin(r_car), 
                dist_b*cos(r_car));

        line(0,0,dist_r*cos(-r_car), dist_r*sin(-r_car));
        line(0,0,dist_l*cos(-r_car), dist_l*sin(-r_car));
        
        let dist_rb = dist_r/cos(45);
        line(0,0,dist_rb*cos(-r_car+45), dist_rb*sin(-r_car+45));
        // line(0,0,dist_r*cos(-r_car-45), dist_r*sin(-r_car-45));
        // line(0,0,dist_r*cos(-r_car+45), dist_r*sin(-r_car+45));
        // line(0,0,dist_r*cos(-r_car+45), dist_r*sin(-r_car+45));

        // Drawing sensor lines
        stroke('yellow');
    
        // line(0,0,radius,0);     // --
        // line(0,0,-radius,0); // --

        // line(0,0,0,radius);  // |
        // line(0,0,0,-radius); // |
    
        // line(0,0,size,size);    // /
        // line(0,0,-size,-size); // /

        // line(0,0,-size,size);  // \
        // line(0,0,size,-size);   // \
        pop();
    }
    displayBounds(){
        push();
        stroke('red');
        let [l,r,t,b] = this.borders;
        strokeWeight(2);
        
        line(l,b,l,t);
        line(r,b,r,t);
        line(l,b,r,b);
        line(l,t,r,t);
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
        this.speed_x += accel_x * this.delta_t;
        this.speed_y += accel_y * this.delta_t;
        
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
        this.pos_x = this.original_pos[0];
        this.pos_y = this.original_pos[1];
        
        // Speed
        this.speed_x = 0;
        this.speed_y = 0;
        
        // Forces
        this.F_appE_x = 0;
        this.F_appE_y = 0;
    }
    get borders(){
        // creating a square border box.
        let size = this.carSize*0.12;

        let left_x = this.pos_x - size;
        let right_x = this.pos_x + size;

        let top_y = this.pos_y + size;
        let bottom_y = this.pos_y - size;

        return [left_x, right_x, top_y, bottom_y]
    }
}
