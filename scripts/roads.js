class Roads {
    constructor(pos_x, pos_y, width, height, color){
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.width = width;
        this.height = height;
        this.color = color || 'lightgrey';

        // the boundaries of the road:
        this.boundaries = [];
    }
    display(){
        // fill('red');
        // rect(this.pos_x, this.pos_y, 10, 10, 10);
    }
    get borders(){
        // returns the sides of the road to determine collision
        let left_x = this.pos_x - this.width/2;
        let right_x = this.pos_x + this.width/2;

        let top_y = this.pos_y + this.height/2;
        let bottom_y = this.pos_y - this.height/2;

        return [left_x, right_x, top_y, bottom_y]
    }
}

class Road_Straight extends Roads {
    constructor(pos_x, pos_y, width, height, color, horizontal){
        super(pos_x, pos_y, width, height, color);

        let l = this.pos_x - this.width/2;
        let r = this.pos_x + this.width/2;
        let b = this.pos_y - this.height/2;
        let t = this.pos_y + this.height/2;

        if (width >= height){
            this.boundaries.push(new Boundary(l,t,r,t));
            this.boundaries.push(new Boundary(r,b,l,b));
        } else {
            this.boundaries.push(new Boundary(r,t,r,b));
            this.boundaries.push(new Boundary(l,b,l,t));
        }
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

        let l = this.pos_x - this.width/2;
        let r = this.pos_x + this.width/2;
        let b = this.pos_y - this.height/2;
        let t = this.pos_y + this.height/2;

        switch (this.pos_curve){
            case 1:
                this.boundaries.push(new Boundary(l,t,l,b));
                this.boundaries.push(new Boundary(r,b,l,b));
                break;
            case 2:
                this.boundaries.push(new Boundary(r,t,r,b));
                this.boundaries.push(new Boundary(r,b,l,b));
                break;
            case 3:
                this.boundaries.push(new Boundary(r,t,r,b));
                this.boundaries.push(new Boundary(r,t,l,t));
                break;
            case 4:
                this.boundaries.push(new Boundary(l,t,l,b));
                this.boundaries.push(new Boundary(r,t,l,t));
                break;
        }
    }
    display(){
        noStroke();
        fill(this.color);

        if  (this.pos_curve === 1){
            rect(this.pos_x, this.pos_y, this.width, 
                this.height, 100, 0, 0, 0);
        }
        else if (this.pos_curve === 2){
            rect(this.pos_x, this.pos_y, this.width, 
                this.height, 0, 100, 0, 0);
        }
        else if (this.pos_curve === 3){
            rect(this.pos_x, this.pos_y, this.width, 
                this.height, 0, 0, 100, 0);
        }
        else if (this.pos_curve === 4){
            rect(this.pos_x, this.pos_y, this.width, 
                this.height, 0, 0, 0, 100);
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

        this.boundaries = [];
        for (let i = 0; i < this.roads.length; i++) {
            const road = this.roads[i];
            this.boundaries.push(...road.boundaries);            
        }
    }
    display(){
        this.roads.forEach(road => {
            road.display();
        });
    }
    onTrack(car){
        // Checks to see if the car is still on the track
        let [left_C, right_C, top_C, bottom_C] = car.borders;
        
        for(let i = 0; i < this.roads.length; i++){
            let roadDim = this.roads[i].borders; 
            let [left_R, right_R, top_R, bottom_R] = roadDim;
            if (right_C >= left_R && left_C <= right_R &&
                top_C >= bottom_R && bottom_C <= top_R ){
                return [true, roadDim];
            }
        }
        return [false, undefined];
    }
}
