const canvas = document.getElementById('c');
canvas.width = 700;
canvas.height = 700;
const c = canvas.getContext('2d');
const gravity = 0;
const lossyPercentage = 0.99;
const scale = 70;
const airResistance = 0.5; 
const min = 0.1;
const launch = 3;
const width = canvas.width/scale;
const height = canvas.width/scale;

function distanceSquared(pos1, pos2) {
    (pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2
} 
const board = [width*height] 
board.length = width*height
for (let i = 0; i < board.length; i++) {
    board[i] = Math.random() > 0.5 && (i > 60 || i < 40) ? 1 : 0
}

let golfBall = new Ball({x:width/2, y:height/2}, new Vector2D(0, 0), 0.3, 'white')

  
var pastTime = 0;
var z = 0;  
const FPS = 60
const multi = airResistance**(1/FPS)
function main(time = 0) {
    let elapsedTime = (time-pastTime)/1000;
    z += elapsedTime
    if (z >= 1/FPS) {
        z = 0;
        c.fillStyle = 'green'
        c.fillRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = 'black'
        let k = 0;
        for (let i = height; i > 0; i--) {
            for (let n = 0; n < width; n++) {
                if (board[k] != 0) {
                    switch (board[k]) {
                        case 1: c.fillStyle = 'black'; break
                        case 2: c.fillStyle = 'yellow'; break

                    }
                    c.fillRect(n*scale, i*scale,scale,scale)
                }
                k++
            }
        }

        golfBall.updatePosition(1/FPS);
        golfBall.draw();
    }
    pastTime = time;
    window.requestAnimationFrame(main);
}
let clickVector = {x: 0, y:0}
canvas.addEventListener('mousedown', e => {
    const box = canvas.getBoundingClientRect();
    const x = e.x - box.left;
    const y = e.y - box.top;
    console.log(x, y)
    clickVector.x = x;
    clickVector.y = y;
});
canvas.addEventListener('mouseup', e => {
    const box = canvas.getBoundingClientRect();
    const x = e.x - box.left;
    const y = e.y - box.top;
    clickVector.x = x - clickVector.x;
    clickVector.y = y - clickVector.y;
    golfBall.vel.x -= clickVector.x*launch/scale;
    golfBall.vel.y += clickVector.y*launch/scale;


})
main();



