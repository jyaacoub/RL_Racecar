class Map {
    constructor(checkpoints, boundaries){
        this.checkpoints = checkpoints || [];
        this.boundaries = boundaries || [];
    }
    toJSON(){ // converts all the individual points for each checkpoint and boundary to strings
        let j = {};
        j.checkpoints = []; // Just a list of numbers corresponding to the (x,y) positions of each checkpoint.
        for (let i = 0; i < this.checkpoints.length; i++) {
            const checkpoint = this.checkpoints[i];
            let point_a = {'x': checkpoint.a.x, 'y': checkpoint.a.y};
            let point_b = {'x': checkpoint.b.x, 'y': checkpoint.b.y};

            j.checkpoints.push([point_a, point_b]);
        }

        j.boundaries = [];
        for (let i = 0; i < this.boundaries.length; i++) {
            const boundary = this.boundaries[i];
            let point_a = {'x': boundary.a.x, 'y': boundary.a.y};
            let point_b = {'x': boundary.b.x, 'y': boundary.b.y};
            j.boundaries.push([point_a, point_b]);
        }

        return j;
    }
    fromJSON(json){ // reads all the points and converts them into Boundary objects
        // empties out the env var:
        this.checkpoints = [];
        this.boundaries = [];
        
        for (let i = 0; i < json.checkpoints.length; i++) {
            const c = json.checkpoints[i];
            this.checkpoints.push(new Boundary(c[0].x, c[0].y, c[1].x, c[1].y, 'green', 5));
        }
        
        for (let i = 0; i < json.boundaries.length; i++) {
            const b = json.boundaries[i];
            this.boundaries.push(new Boundary(b[0].x, b[0].y, b[1].x, b[1].y));
        }
    }
    saveMap(){
        const content = JSON.stringify(this.toJSON());

        let a = document.createElement('a');
        a.href = "data:text/json;charset=utf-8," 
                    + encodeURIComponent(content);
        a.download = 'Map.json';
        a.click();
        a.remove();
    }
    loadMap(fileName){
        let filePath = '../maps/';
        if (fileName){
            filePath += fileName;
        } else {
            filePath += this.constructor.name; // default name.
            filePath += '.json'
        }
        console.log('Loading from json:', filePath);
        let map = this;

        $.getJSON(filePath, function(data){
            console.log('Success');
            map.fromJSON(data);
        }).fail(function(){
            console.log('Failed');
        });
    }
}