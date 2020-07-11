const screenW = 1500;
const screenH =  840;

let date = new Date();

FR = 10;

function setup() {
    createCanvas(screenW, screenH);
    background('Green');
    frameRate(FR);
}
async function delay(delayInms) {
    return new Promise(resolve  => {
        setTimeout(() => {
        resolve(2);
        }, delayInms);
    });
}
// async function sample() {
//     console.log('a');
//     console.log('waiting...')
//     let delayres = await delay(3000);
//     console.log('b');
// }
function draw() {
    circle(30,30,30);
    // background('Green');
    var startTime = date.getTime();
    while (date.getTime() - startTime < 1000){
        console.log(startTime);
    }
    clear();
    background('Green');
}
