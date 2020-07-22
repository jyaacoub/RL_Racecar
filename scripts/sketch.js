const screenW = 1500;
const screenH =  840;

let FR = 100;

let raceCar;
let raceCar2;
let track;

let rays = [];
let ray;
let mag = 500;
let boundaries = [];

let origin;

function setup() {
    createCanvas(screenW, screenH);
    frameRate(FR);

    angleMode(DEGREES);
    rectMode(CENTER);

    origin = createVector(350, 230);

    // raceCar = new RaceCar(0, screenH-100, 40);
    // raceCar2 = new RaceCar(0, screenH-125, 40);
    // track = new Track(screenH, screenW);
    
    for (let i = 0; i < 360; i += 1) {
        rays.push(new Ray(origin.x,origin.y,mag,i));
    }

    boundaries.push(new Boundary(500,100,500,500));
    boundaries.push(new Boundary(100,300,400,100));
    boundaries.push(new Boundary(200,300,400,400));
    boundaries.push(new Boundary(500,300,400,400));
    boundaries.push(new Boundary(1000,500,600,400));
    boundaries.push(new Boundary(1200,600,700,600));
}

function draw() {
    clear();
    background('black');

    displayBounds();

    // renderBackground();

    // let roadDim = collisionDetection(raceCar); // collision detection

    // checkKeys1(raceCar);
    // raceCar.applyForces();
    // raceCar.display();
    // raceCar.displaySensors(roadDim);

    // raceCar.displayBounds();
    // // checkKeys2(raceCar2);
    // // raceCar2.applyForces();
    // // raceCar2.display();
}
// TODO: Fix bug where not all rays are rendering after shortening them.
// Still one more bug... 
function displayBounds(){
    for (let i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }

    for (let j = 0; j < rays.length; j++) {
        let ray = rays[j];
        ray.x1 = origin.x;
        ray.y1 = origin.y;
        ray.recalculateSize();
        let p;
        let min_dist = ray.magnitude;
        let min_p;
        let x2_new;
        let y2_new;
        // Finding the closest boundary
        for (let i = 0; i < boundaries.length; i++) {
            p = ray.cast(boundaries[i]);
            if (p){
                let x = p.x - ray.x1;
                let y = p.y - ray.y1;
                let p_dist = sqrt(x**2 + y**2);

                if (p_dist <= min_dist){
                    min_p = p;
                    min_dist = p_dist;
                    x2_new = x;
                    y2_new = y;
                }
            } 
        }
        if (min_p){
            // push();
            // strokeWeight(7);
            // stroke('blue');
            // point(min_p.x, min_p.y);
            // pop();
            ray.x2 = x2_new;
            ray.y2 = y2_new;
        }
        
        ray.show();
    }
}

function renderBackground(){
    background(0,40,0);
    track.display();
}

function collisionDetection(car){
    let [onTrack, roadDim] = track.onTrack(car);
    
    if (!onTrack){
        car.resetPos();
    }

    return roadDim;
}

function checkKeys1(car){
    // Turning
    if (keyIsDown(LEFT_ARROW)) {
        car.move('l');
    }
    if (keyIsDown(RIGHT_ARROW)) {
        car.move('r');
    }

    // Moving
    if (keyIsDown(UP_ARROW)) {
        car.move('f');
    }
    if (keyIsDown(DOWN_ARROW)) {
        car.move('b');
    }
}

function checkKeys2(car){
    // Turning
    if (keyIsDown(65)) { // 'A'
        car.move('l');
    }
    if (keyIsDown(68)) { // 'D'
        car.move('r');
    }

    // Moving
    if (keyIsDown(87)) { // 'W'
        car.move('f');
    }
    if (keyIsDown(83)) { // 'S'
        car.move('b');
    }
}

function mouseDragged(event) {
    origin.x = mouseX;
    origin.y = mouseY;
}
