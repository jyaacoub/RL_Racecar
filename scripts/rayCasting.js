class Boundary {
    constructor(x1,y1,x2,y2){
        this.a = createVector(x1,y1);
        this.b = createVector(x2,y2);
    }
    show(){
        push();
        strokeWeight(3);
        stroke('white');
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        pop();
    }
}

class Ray {
    constructor(x1, y1, magnitude, dir, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.magnitude = magnitude;
        this.dir = dir;
        // The angle of direction is relative to the west.
        this.x2 = x2 || -magnitude*cos(dir);
        this.y2 = y2 || -magnitude*sin(dir);
    }
    show(){
        push();
        stroke('green');
        strokeWeight(1);
        translate(this.x1, this.y1);
        line(0,0,this.x2, this.y2);

        // stroke('red');
        // strokeWeight(10);
        // point(0,0);
        pop();
    }
    recalculateSize(){
        this.x2 =-this.magnitude*cos(this.dir);
        this.y2 =-this.magnitude*sin(this.dir);
    }
    cast(boundary){
        /* This determines if the ray intersects with the boundary
        *   If it does it returns the point at which it does.
        *   If they don't intersect it returns undefined
        * 
        *  Source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection 
        */ 
        
        // Ray points:
        const x1 = this.x1;
        const y1 = this.y1;
        const x2 = this.x2 + x1;
        const y2 = this.y2 + y1;

        // Boundary points:
        const x3 = boundary.a.x;
        const y3 = boundary.a.y;
        const x4 = boundary.b.x;
        const y4 = boundary.b.y;

        // Now to calculate t and u (note both of these have the same denominator)
        let denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);

        if (denom === 0){
            return; // means the lines are parallel.
        }
        
        
        let u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / denom;    // intersection on the second segment
        let t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;    // intersects within the first segment

        
        if ((0.0 <= u && u <= 1.0) && (0.0 <= t && t <= 1.0)){
            let intersect_point = createVector(x3 + u*(x4-x3), y3 + u*(y4-y3));
            return intersect_point; 
        }
        
        // if ((0.0 <= t && t <= 1.0)){
        //     let intersect_point = createVector(x1 + t*(x2-x1), y1 + t*(y2-y1));
        //     return intersect_point; 
        // }
    }
}