function Object_(type){
  this.position = createVector(0,0,0);
  this.velocity = createVector(0,0,0);
  this.propulsion = createVector(0,0,0);
  this.radious = 0;
  this.mass = 0;
  this.name = type;
  this.inclination = 0;

  this.gravityAcc = createVector(0,0,0);

  this.scale = 1;
  this.color = color(0,0,0);

  this.dt = 5;

  this.history = [];
  this.history2 = [];
  this.iter = 0;

  this.setType = function(type) {
    switch(type){
      case "EARTH":
      this.setColor(color(0,128,255,200));
      this.setRadious(6371*1000);
      this.setMass(5.97219*10**24);
      this.setPosition(createVector(0,0,0));
      this.setVelocity(createVector(0,0,0));
      break;
      case "MOON":
      this.setColor(color(192,192,192,200));
      this.setRadious(1738*1000);
      this.setMass(7.34767309*10**22);
      this.setPosition(createVector(363300*1000,0,0));
      this.setVelocity(createVector(0,1.076*1000,0));
      break;
      case "MOON2":
      this.setColor(color(192,192,192,200));
      this.setRadious(1738*1000);
      this.setMass(7.34767309*10**22);
      this.setPosition(createVector(-385000*1000,0,0));
      this.setVelocity(createVector(0,-1.022*1000,0));
      break;
      case "ISS":
      this.setColor(color(220,220,220,200));
      this.setRadious(550000);
      this.setMass(417289);
      this.setPosition(createVector((6371+405)*1000,0,0));
      this.setVelocity(createVector(0, 7706.6, 0));
      break;
      case "IRYDIUM":
      this.setColor(color(128,220,0,200));
      this.setRadious(550000);
      this.setMass(417289);
      this.setPosition(createVector((6371+781)*1000,0,0));
      this.setVelocity(createVector(0, 7500, 0));
      break;
      case "GEO":
      this.setColor(color(255,51,153,200));
      this.setRadious(550000);
      this.setMass(417289);
      this.setPosition(createVector((6371+35786)*1000,0,0));
      this.setVelocity(createVector(0, 3070, 0));
      break;
      case "RAND":
      this.setColor(color(200,0,0,200));
      this.setRadious(550000);
      this.setMass(417289);
      this.setPosition(createVector((6371+557)*1000,0,0));
      this.setVelocity(createVector(0, 10070, 0));
      break;
      case "RAND2":
      this.setColor(color(200,0,0,200));
      this.setRadious(550000);
      this.setMass(417289);
      this.setPosition(createVector(800000,500000,(6371+1000)*1000));
      this.setVelocity(createVector(8000, 3000, 0));
      break;
    }
  }

  this.setTimeStep = function (dt) {
    this.dt = dt;
  }

  this.setColor = function(c) {
    this.color = c;
  }

  this.setPosition = function(p){
    this.position = p;
  }

  this.setVelocity = function(v){
    this.velocity = v;
  }

  this.setMass = function(m){
    this.mass = m;
  }

  this.setName = function(n) {
    this.name = name;
  }

  this.setRadious = function(r) {
    this.radious = r;
  }

  this.init = function(r, mass, pos, velo, prop) {
    this.radious = r;
    this.mass = mass;
    this.position = pos;
    this.velocity = velo;
    this.propulsion = prop;
  }

  this.setScale = function(s) {
    this.scale = s;
  }

  this.display = function() {
    drawSphere(this.radious, this.scale, this.position, this.color);
    textSize(10);
    fill(0,250,250,200);
    stroke(0,0,250,200);
    text(this.name, (this.position.x+this.radious)*this.scale, (this.position.y+this.radious)*this.scale);
  }

  this.gravityUpdate = function (grav) {
    this.gravityAcc.x = this.gravityAcc.x + grav.x;
    this.gravityAcc.y = this.gravityAcc.y + grav.y;
    this.gravityAcc.z = this.gravityAcc.z + grav.z;
  }

  this.motionUpdate = function () {
    var prevPosition = this.position.copy();
    var prevVelocity = this.velocity.copy();
    this.addToHistory(this.position);

    //velocity update
    this.velocity.x = this.velocity.x + this.gravityAcc.x*this.dt;
    this.velocity.y = this.velocity.y + this.gravityAcc.y*this.dt;
    this.velocity.z = this.velocity.z + this.gravityAcc.z*this.dt;
    
    //position update
    this.position.x = this.position.x + prevVelocity.x*this.dt + 1*this.gravityAcc.x*this.dt*this.dt;
    this.position.y = this.position.y + prevVelocity.y*this.dt + 1*this.gravityAcc.y*this.dt*this.dt;
    this.position.z = this.position.z + prevVelocity.z*this.dt + 1*this.gravityAcc.z*this.dt*this.dt;
  }

  this.motionUpdateFR = function () {
  //https://blog.frogslayer.com/universe-sandbox-simulation-analysis/
  }

  this.velocityUpdate = function (grav) {
    this.velocity.x = this.velocity.x + grav.x*this.dt;
    this.velocity.y = this.velocity.y + grav.y*this.dt;
    this.velocity.z = this.velocity.z + grav.z*this.dt;
  }

  this.positionUpdate = function () {
    this.addToHistory(this.position);
    this.position.x = this.position.x + this.velocity.x*this.dt + 0.5*this.gravityAcc.x*this.dt*this.dt;
    this.position.y = this.position.y + this.velocity.y*this.dt + 0.5*this.gravityAcc.y*this.dt*this.dt;
    this.position.z = this.position.z + this.velocity.z*this.dt + 0.5*this.gravityAcc.z*this.dt*this.dt;
  }

  this.addToHistory = function (pos) {
    if(this.history.length >= 100) this.history.splice(0,1);
    if(this.history.length == 0) this.history.push(pos.copy());
    else if(p5.Vector.dist(this.history[this.history.length-1], pos) > 500000) this.history.push(pos.copy());

  }

  this.drawHistory = function () {
    strokeWeight(2);
    beginShape(POINTS);
    for (var i = 0; i < this.history.length; i++) {
      stroke(250,250,250,250/this.history.length*i);
      var pos = this.history[i];
      vertex(pos.x*this.scale, pos.y*this.scale, pos.z*this.scale);
    }
    endShape();
  }

  this.gravity = function(body) {
    var dist = p5.Vector.dist(this.position, body.position);
    var grav = 6.674*Math.pow(10,-11)* body.mass / (dist)**2;
    var vect = createVector((body.position.x-this.position.x)/dist, (body.position.y-this.position.y)/dist, (body.position.z-this.position.z)/dist);

    var x = grav * vect.x;
    var y = grav * vect.y;
    var z = grav * vect.z;

    return createVector(x,y,z);
  }

  this.setType(type); //wpisz parametry !!!!
}



function ObjectsGroup(){
  this.satellites = [];
  this.planets = [];

  this.newSatellite = function() {
    this.satellites.push(new Object_());
  }

  this.newPlanet = function() {
    this.planets.push(new Object_());
  }

  this.removeSatellite = function(no) {
    this.satellites.splice(no, 1);
  }

  this.removeSatellite = function(no) {
    this.planets.splice(no, 1);
  }
}

function drawSphere(r, s, pos, col){
  fill(col);
  stroke(50);
  ellipse(pos.x*s, pos.y*s, r*s*2, r*s*2);
}
