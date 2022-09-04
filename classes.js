class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y; 
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    subtract(vector, scale) {
        this.x -= vector.x*scale;
        this.y -= vector.y*scale;
    }
    multiply(scale) {
        return new Vector2D(this.x*scale, this.y*scale)
    }
    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    normalise   () {
        let mag = this.magnitude()
        this.x /= mag;
        this.y /= mag;
    }
    dot(vector) {
        return this.x * vector.x +  this.y * vector.y
    }
}
class Ball {
    color = 'orange'
    collision = true;
    mass = 1;
    
    constructor(pos, vel, radius, color) {
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.fillStyle = this.color
        c.beginPath();
        c.arc(this.pos.x*scale, canvas.height -this.pos.y*scale, this.radius*scale, 0, 2 * Math.PI);
        c.fill();

        c.lineWidth = 4;
        c.beginPath();
        c.arc(this.pos.x*scale, canvas.height -this.pos.y*scale, this.radius*scale, 0, 2 * Math.PI);
        c.stroke();

        c.fillStyle = 'black'
    
        // c.beginPath();
        // c.moveTo(this.pos.x*scale , canvas.height - this.pos.y*scale)
        // c.lineTo((this.pos.x + this.vel.x/this.radius)*scale, canvas.height - (this.pos.y  + this.vel.y/this.radius)*scale)
        // c.stroke();
    }
    updatePosition(time) {
        // if ((this.vel.x < min && this.vel.x > -min) && (this.vel.y < min && this.vel.y > -min)) {
        //     this.vel.x = 0;
        //     this.vel.y = 0;
        // }


        const x = Math.floor(this.pos.x);
        const y = Math.floor(this.pos.y)+1;
        const dx = this.vel.x*time;
        const dy = this.vel.y*time;
        const pos = y*width + x;
        c.fillStyle = 'yellow'
        c.fillRect(x*scale,canvas.width-y*scale, scale, scale)
        
        if (this.pos.x + dx + this.radius >= x+1 &&
            this.vel.x >= 0 &&
            board[pos+1] !== 0

            ) {
            //console.log(this.pos.x + dx + this.radius, x+1)
            this.vel.x *= -1;
            this.pos.x += dx;

        } else if (this.pos.x + dx - this.radius <= x &&
                   this.vel.x <= 0 &&
                   board[pos-1] !== 0) {
            this.vel.x *= -1;
            this.pos.x += dx;
        }
        else {
            this.pos.x += dx;
        }
        if (board[pos] !== 0) {
            console.log("UH OH")
        }
        console.log(this.pos.y + dy - this.radius, y)

        if (this.pos.y + dy + this.radius >= y &&
            this.vel.y >= 0 &&
            board[pos+width] !== 0 && board[pos+width] !== undefined    

            ) {
            console.log(this.pos.y + dy + this.radius, y+width)
            this.vel.y *= -1;
            this.pos.y += dy;
        
        } else if (this.pos.y + dy - this.radius <= y-1 &&
            this.vel.y <= 0 &&
            board[pos-width] !== 0 && board[pos-width] !== undefined  
            ) {
                this.vel.y *= -1;
                this.pos.y += dy;
        }
            // else if (this.pos.x + dx - this.radius <= x &&
            //            this.vel.x <= 0 &&
            //            board[pos+1] !== 0) {
            // }
            // else {
            //     this.pos.x += dx;
            // }



        if (this.pos.y - this.radius < 0) {
            this.vel.y *= -lossyPercentage;
            this.pos.y = this.radius;
        }
        else if (this.pos.y + this.radius >= height) {
            this.vel.y *= -lossyPercentage; 
            this.pos.y = height-this.radius;
        }
        if (this.pos.x - this.radius < 0 ) {
            this.vel.x *= -lossyPercentage;
            this.pos.x = this.radius
        } 
        else if (this.pos.x + this.radius >= width) {
            this.vel.x *= -lossyPercentage;
            this.pos.x = width - this.radius
        }
        
        //this.pos.x += this.vel.x*time;
        this.pos.y += this.vel.y*time;
        this.vel = this.vel.multiply(multi);
    }  
    
    checkCollisions() {
        

        if (this.pos.x <=    this.radius) {
            this.pos.x = this.radius//-this.pos.x + 2*this.radius;
            this.vel.x *= -1;
        } 
        else if (this.pos.x >= canvas.width-this.radius) {
            this.pos.x = -this.pos.x+2*(canvas.width-this.radius)
            this.vel.x *= -1;
        }
        if (this.pos.y <= this.radius) {
            this.pos.y = -this.pos.y + 2*this.radius;
            this.vel.y *= -1;
        }
     
    }
    isCollision(ball) {
        let distance2 = (this.pos.x - ball.pos.x)**2 + (this.pos.y - ball.pos.y)**2
        return distance2 <= (this.radius + ball.radius)**2 && ball !== this && this.collision;
    }
    collide(ballB) {
        const unitNormal = new Vector2D((ballB.pos.x - this.pos.x), (ballB.pos.y - this.pos.y));
        unitNormal.normalise()
        const unitTangent = new Vector2D(-unitNormal.y, unitNormal.x);

        // Sets up the two vector axises
        const totalMass = this.mass + ballB.mass;
    
        const v1n = unitNormal.dot(this.vel);
        const v1t = unitTangent.dot(this.vel);
        const v2n = unitNormal.dot(ballB.vel);
        const v2t = unitTangent.dot(ballB.vel);

        const v1nDelta = (v1n*(this.mass-ballB.mass) + 2*ballB.mass*v2n)/totalMass;
        const v2nDelta = (v2n*(ballB.mass-this.mass) + 2*this.mass*v1n)/totalMass;
    
    
        this.vel = unitNormal.multiply(v1nDelta);
        this.vel.add(unitTangent.multiply(v1t));
    
        ballB.vel = unitNormal.multiply(v2nDelta);
        this.vel.add(unitTangent.multiply(v2t));
    
        
    }
}
