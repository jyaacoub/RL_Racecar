class RaceCar {
    constructor(pos_x, pos_y, carSize, mass, engine_power, rotationSpeed, 
                K_friction, gravity, frameRate){
        this.carSize = carSize || 50;
        this.mass = mass || 10000;

        this.pos_x = pos_x || 750; // Chosen to be the center of the screen
        this.pos_y = pos_y || 420;

        this.engine_power = engine_power || 430;
        this.rotationSpeed = rotationSpeed || 2;

        this.K_friction = K_friction || 0.1;
        this.gravity = gravity || 9.8;
        this.delta_t = 1/frameRate || 1/100;

        this.carSizeW = this.carSize;
        this.carSizeH = this.carSize/2;

        this.F_friction = this.K_friction * this.mass * this.gravity;
        
        this.F_appE = this.engine_power * this.mass;
        this.F_appE_x = 0;
        this.F_appE_y = 0;

        this.speed_x = 0;
        this.speed_y = 0;

        this.rotation = 0;
        this.carBody = 'green';
    }

    display(){
        noStroke();
        translate(this.pos_x, this.pos_y);
        rotate(this.rotation);

        const w = this.carSizeW;
        const h = this.carSizeH;
        const size = this.carSize;

        // Drawing body and shape
        fill('dark'+this.carBody);
        rect(0, 0, w, h, 10);
    
        fill(80);
        rect(0,0, w*0.5, h*0.6, 10);
        
        fill('red');
        circle(w*(46/100), h/4, size/13);
        circle(w*(46/100), -h/4, size/13);
    
        fill('white');
        circle(-w*(44/100), h/4, size/10);
        circle(-w*(44/100), -h/4, size/10);
    
        // Drawing sensor lines
        // stroke('black');
        // const inLine = sqrt(2*size**2);
    
        // strokeWeight(0.01*size);
        // line(0,0,size,size);
        // line(0,0,inLine,0);
        // line(0,0,0,inLine);
    
        // line(0,0,-size,-size);
        // line(0,0,-inLine,0);
        // line(0,0,0,-inLine);
    
        // line(0,0,-size,size);
        // line(0,0,size,-size);

    }
    applyForces(){

        let F_friction_x = -this.speed_x * this.F_friction;
        let F_friction_y = -this.speed_y * this.F_friction;
    
        let F_net_x = F_friction_x + this.F_appE_x;
        let F_net_y = F_friction_y + this.F_appE_y;
    
        let accel_x = F_net_x / this.mass;
        let accel_y = F_net_y / this.mass;
    
        this.speed_x += accel_x * this.delta_t;
        this.speed_y += accel_y * this.delta_t;
        
        this.pos_x += this.speed_x * this.delta_t + 0.5 * accel_x * (this.delta_t**2);
        this.pos_y += this.speed_y * this.delta_t + 0.5 * accel_y * (this.delta_t**2);
    
        this.F_appE_x = 0;
        this.F_appE_y = 0;
    }
}

class Roads {
    constructor(pos_x, pos_y, width, height, color){
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.width = width;
        this.height = height;
        this.color = color || 'lightgrey';
    }
    display(){
        fill('red');
        rect(this.pos_x, this.pos_y, 10, 10, 10);
    }
}


class Road_Straight extends Roads {
    constructor(pos_x, pos_y, width, height, color){
        super(pos_x, pos_y, width, height, color);
    }

    display(){
        noStroke();
        fill(this.color);
        rect(this.pos_x, this.pos_y, this.width, this.height);
        super.display();
    }
}
class Road_Turn extends Roads {
    constructor(pos_x, pos_y, width, height,  pos_curve, color){
        super(pos_x, pos_y, width, height, color);
        this.pos_curve = pos_curve || 1;
    }

    display(){
        noStroke();
        fill(this.color);
        console.log(this.pos_curve);
        if  (this.pos_curve === 1){
                rect(this.pos_x, this.pos_y, this.width, this.height, 100, 0, 0, 0);
        }
        else if (this.pos_curve === 2){
            rect(this.pos_x, this.pos_y, this.width, this.height, 0, 100, 0, 0);
        }
        else if (this.pos_curve === 3){
            rect(this.pos_x, this.pos_y, this.width, this.height, 0, 0, 100, 0);
        }
        else if (this.pos_curve === 4){
            rect(this.pos_x, this.pos_y, this.width, this.height, 0, 0, 0, 100);
        }
        super.display();
    }
}

class Track {
    constructor(s_H, s_W){
        this.roads = [];
        // Horizontals
        this.roads.push(new Road_Straight(s_W/2, s_H-100, s_W-300, 100));
        this.roads.push(new Road_Straight(s_W/2, 100, s_W-300, 100));

        // Verticals
        this.roads.push(new Road_Straight(100, s_H/2, 100, s_H-300));
        this.roads.push(new Road_Straight(s_W-100, s_H/2, 100, s_H-300));

        // Corners
        this.roads.push(new Road_Turn(100, 100, 100, 100, 1));
        this.roads.push(new Road_Turn(s_W-100, 100, 100, 100, 2));
        this.roads.push(new Road_Turn(100, s_H-100, 100, 100, 4));
        this.roads.push(new Road_Turn(s_W-100, s_H-100, 100, 100, 3));
    }

    display(){
        this.roads.forEach(road => {
            road.display();
        });
    }
}