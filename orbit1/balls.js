function Balls (g) {
  this.R = random(5,50);

  this.position = createVector(mouseX + random(-20, 20), mouseY + random(-20, 20), mouseY + random(-20, 20));
  this.velocity = createVector(0,0,0);
  this.grav = g;

  this.drag_coff = 0.01;
  this.bouceEfficiency = 0.05;

  this.dt = 0.1;

  this.color = color(random(0, 250), random(0, 250), random(0, 250));

  this.setDragCoff = function(coff){
    this.drag_coff = coff;
  }

  this.setBouceEfficiency = function(eff){
    this.bouceEfficiency = eff;
  }

  this.setGravity = function(vect) {
    this.gravity = vect;
  }

  this.pushV = function(){
    this.velocity.x = random(-50,50);
    this.velocity.y = random(-50,50);
    this.velocity.z = random(-3,2);
  }

  this.momentum = function(){
    //this.position = p5.Vector.add(this.position, this.velocity*this.dt);

    this.position.x = this.position.x + this.velocity.x*this.dt;
    this.position.y = this.position.y + this.velocity.y*this.dt;
    this.position.z = this.position.z + this.velocity.z*this.dt;
  }

  this.bump = function(){
 if( this.position.y >= (Yscreen - this.R/2)){
   this.velocity.y = -this.velocity.y*(1-friction);
   this.position.y = (Yscreen - this.R/2);
 }
 else if( this.position.y <= this.R/2){
   this.velocity.y = -this.velocity.y*(1-friction);
   this.position.y = this.R/2;
 }
 if( this.position.x >= (Xscreen - this.R/2)){
   this.position.x = (Xscreen - this.R/2);
   this.velocity.x = -this.velocity.x*(1-friction);
 }
 else if( this.position.x <= this.R/2){
   this.velocity.x = -this.velocity.x*(1-friction);
   this.position.x = this.R/2;
 }
}

  this.drag = function(){
    this.velocity.x = this.velocity.x*(1-drag_coff);
    this.velocity.y = this.velocity.y*(1-drag_coff);
    this.velocity.z = this.velocity.z*(1-drag_coff);
  }

  this.gravity = function() {
    //this.velocity = p5.Vector.add(this.velocity, this.grav*this.dt);
    this.velocity.x = this.velocity.x + this.grav.x*this.dt;
    this.velocity.y = this.velocity.y + this.grav.y*this.dt;
    this.velocity.z = this.velocity.z + this.grav.z*this.dt;
  }

  this.move = function(){
    this.momentum();
    this.bump();
    this.gravity();
    this.drag();
  }

  this.setRadious = function(radious){
    this.R = radious;
}

  this.display = function(){
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.R, this.R);
  }
}

function BallsGroup(){
  this.balls = [];
  this.grav = createVector(0,0,0);

  this.setGravity = function(g) {
    this.grav = g;
    var i = 0;
    while(i < this.balls.length){
      this.balls[i].setGravity(this.grav);
    }
    print(this.grav);
  }

  this.addBall = function(){
    this.balls.push(new Balls(this.grav));
    this.balls[this.balls.length-1].pushV();
    print(this.balls[this.balls.length-1]);
  }

  this.removeBall = function(){
    this.balls.pop();
  }

  this.clear = function(){
    while(this.balls.length){
      this.balls.pop();
    }
  }

  this.removeIdle = function(){
    var i = 0;
    while(i < this.balls.length){
      if((this.balls[i].velocity.mag() < 10) && (this.balls[i].position.y >= (Yscreen-this.balls[i].R/2))) this.balls.splice(i,1);
      else i++;
    }
  }

  this.display = function(){
    for(i=0; i<this.balls.length; i++){
      this.balls[i].move();
      this.balls[i].display();
      this.removeIdle();
    }
  }
}
