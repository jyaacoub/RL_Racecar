// TODO: Create a pipeline to connect the "frontend" graphics to the backend AI 
// that controls the car

class RL_controller {
    constructor(car){
        this.car = car;     // The car that it will be in control of.
        
    }
    reciveInput(distances){
        // The input thet the model recives are the values from 
        // the sensors of the vehicle.
    }
    decideOnAction(){
        // From the current distances it decides what action to perform next
    }
    performAction(car){
        // There are 4 differant things the model can do:
        //      Turn left, turn right, accelerate, and reverse.
    }
    get fitness(){

    }
}

class GA_controller {
    constructor(car){
        this.car = car;     // The car that it will be in control of.
        
    }
    decideOnAction(){
        // From the current distances it decides what action to perform next
    }
    performAction(car){
        // There are 4 differant things the model can do:
        //      Turn left, turn right, accelerate, and reverse.
    }
    get fitness(goal){
        
    }
}