var dt = 0.05;
var g;
var maxBalls = 100;

dt = 0.1;
var Xscreen = 600;
var Yscreen = 600;

var drag_coff = 0.01;
var friction = 0.05;
var ballsGroup = 0;

function setup(){
  createCanvas(Xscreen, Yscreen);
  background(150);
  g = createVector(0, 100,0);
  ballsGroup = new BallsGroup();
  ballsGroup.setGravity(createVector(0, 100,0));
}

function draw(){
  background(150);
  ballsGroup.display();

  if(mouseIsPressed){
    if((mouseButton == LEFT) && (ballsGroup.balls.length < maxBalls)) ballsGroup.addBall();
    else if(mouseButton == RIGHT) ballsGroup.removeBall();
    else if(mouseButton == CENTER) ballsGroup.clear();
  }

}
