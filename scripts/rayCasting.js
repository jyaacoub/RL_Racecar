class Boundary {
    constructor(x1,y1,x2,y2){
        this.a = createVector(x1,y1);
        this.b = createVector(x2,y2);
    }
    show(){
        push();
        strokeWeight(3);
        stroke('white');
        line(this.a.x, this.a.y, 
            this.b.x, this.b.y);
        pop();
    }
}

class Ray {
    constructor(x, y, magnitude, dir){
        this.origin = createVector(x, y);

        // The angle of direction is relative to the west.
        this.dir = createVector(-magnitude*cos(dir), 
                                -magnitude*sin(dir)); 
    }
    show(){
        push();
        stroke('yellow');
        strokeWeight(3);
        translate(this.origin.x, this.origin.y);
        line(0,0,this.dir.x, this.dir.y);

        stroke('red');
        strokeWeight(10);
        point(0,0);
        pop();
    }
    cast(boundary){
        /* This determines if the ray intersects with the boundary
        *   If it does it returns the point at which it does.
        *   If they don't intersect it returns undefined
        * 
        *  Source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection 
        */ 
        
        // Ray points:
        const x1 = this.origin.x;
        const y1 = this.origin.y;
        const x2 = this.dir.x;
        const y2 = this.dir.y;

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
        
        let t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;    // intersects within the first segment
        let u = ((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / denom;   

        if (!(0.0 <= t && t <= 1.0)){
            return; // Does not intersect.
        }
        if (!(0.0 <= u && u <= 1.0)){
            return; // Does not intersect.
        }
    }
}