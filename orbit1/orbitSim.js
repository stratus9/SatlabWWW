var realSize = 800000000;
var realScale = 1000/realSize;
var offsetX = realSize*realScale/2;
var offsetY = realSize*realScale/2;
var canvasX = realSize*realScale;
var canvasY = realSize*realScale;

var earth;
var moon;
var satellite;
var satellite2;
var satellite3;

var pMouseX = 0;
var pMouseY = 0;
var dragEnabled = 0;
var drageCountStore = 0;

var tmpOffset = 0;

var gui;
var dt_gui = '';
var myAngle = 'test';

var meter;

function setup(){
  //frameRate(1);
  createCanvas(canvasX, canvasY);
  meter = new FPSMeter({top: '100px', theme: 'colorful'});
  background(10);
  noCursor();
  //frameRate(20);
  earth = new Object_("EARTH");
  moon = new Object_("MOON");
  satellite = new Object_("ISS");
  satellite2 = new Object_("GEO");
  satellite3 = new Object_("RAND2");
  earth.setScale(realScale);
  moon.setScale(realScale);
  satellite.setScale(realScale);
  satellite2.setScale(realScale);
  satellite3.setScale(realScale);
  
  //======================  GUI  ============================
  //---------------------- Select object ---------------------
  input_label_list = createElement('h4', 'Select object');
  input_label_list.position(canvasX+10, 100);
  
  input_list = createSelect();
  input_list.position(canvasX+10, 140);
  input_list.attribute('disabled','');
  input_list.option('ISS');
  input_list.option('Earth');
  input_list.option('Moon');
  input_list.option('GEO');
  //input_list.changed(mySelectEvent);	//centrowanie na obiekt i wyświetlenie jego parametrów
  
  //-------------------- Object velocity --------------------
  output_label_velo = createElement('h4', 'Current velocity [m/s]');
  output_label_velo.position(canvasX+10, 0);
  
  output_velo = createInput();
  output_velo.position(canvasX+10, 40);
  output_velo.attribute('disabled','');
  
  //------------- Object distance from Earth -----------------
  output_label_distance = createElement('h4', 'Distance from Earth [km]');
  output_label_distance.position(canvasX+10, 50);
  
  output_distance = createInput();
  output_distance.position(canvasX+10, 90);
  output_distance.attribute('disabled','');
  
  //----------------- Position over Earth ---------------------
  output_label_position = createElement('h4', 'Position over Earth');
  output_label_position.position(canvasX+10, 150);
  
  output_positionNS = createInput();
  output_positionNS.position(canvasX+10, 190);
  output_positionNS.attribute('disabled','');
  output_positionEW = createInput();
  output_positionEW.position(canvasX+10, 210);
  output_positionEW.attribute('disabled','');
  
}

function draw() {
  meter.tick();
  background(10);
  output_velo.value(p5.Vector.mag(satellite.velocity));
  output_distance.value((p5.Vector.mag(satellite.position)-earth.radious)/1000);
  output_positionNS.value(((satellite.position.x >=0) ? 'N ' : 'S ') + abs(satellite.position.x/100000));
  output_positionEW.value(((satellite.position.y >=0) ? 'E ' : 'W ') + abs(satellite.position.y/100000));
  
  moon.gravityAcc = createVector(0,0,0);
  satellite.gravityAcc = createVector(0,0,0);
  satellite2.gravityAcc = createVector(0,0,0);
  satellite3.gravityAcc = createVector(0,0,0);

  moon.gravityUpdate(moon.gravity(earth));
  satellite.gravityUpdate(satellite.gravity(earth));
  satellite2.gravityUpdate(satellite2.gravity(earth));
  satellite3.gravityUpdate(satellite3.gravity(earth));

  moon.motionUpdate();
  satellite.motionUpdate();
  satellite2.motionUpdate();
  satellite3.motionUpdate();
  
  push();
  translate(offsetX, offsetY);
  earth.display();
  moon.display();
  satellite.display();
  satellite2.display();
  satellite3.display();

  moon.drawHistory();
  satellite.drawHistory();
  satellite2.drawHistory();
  satellite3.drawHistory();
  pop();
 
  drawArrow();
  
}

function mouseWheel(event) {
  if((mouseX >= 0) && (mouseY >= 0) && (mouseX <= canvasX) && (mouseY <= canvasY)){
  	var tmp = event.delta/100000000;
    if((realScale + tmp) > 0.00000125) realScale += tmp;
    earth.setScale(realScale);
    moon.setScale(realScale);
    satellite.setScale(realScale);
    satellite2.setScale(realScale);
    satellite3.setScale(realScale);
  
  //if(tmp > 0) offsetX = offsetX-(mouseX-width/2)/10;
  //else offsetX = offsetX-(mouseX+width/2)/10;
  }
  return false;
}

function mouseDragged() {
	if(dragEnabled) {
		var dMouseX = mouseX-pMouseX;
		var dMouseY = mouseY-pMouseY;
		pMouseX = mouseX;
		pMouseY = mouseY;
		offsetX += dMouseX;
		offsetY += dMouseY; 
		tmpOffset += dMouseX;
	}
}

function mousePressed() {
	if((mouseX >= 0) && (mouseY >= 0) && (mouseX <= canvasX) && (mouseY <= canvasY)) dragEnabled = 1;
	pMouseX = mouseX;
	pMouseY = mouseY; 
}

function mouseReleased() {
	dragEnabled = 0;
}


function drawArrow(){
  var arrowScale = 4/5;
  var tailWidth = 5*arrowScale;
  var tailLength = 15*arrowScale;
  var arrowLegth = 10*arrowScale;
  var arrowWidth = 20*arrowScale;
  var pointSize = 2*arrowScale;
  var offset = ((abs((frameCount-drageCountStore)%100-50)/5)+2)*arrowScale;
  
  if(dragEnabled){
  	offset = 0;
  	drageCountStore = frameCount;
  }
  
  stroke(0);
  fill(255,255,255, 200);

  beginShape();
  vertex(mouseX,mouseY+offset);
  vertex(arrowWidth/2+mouseX,arrowLegth+mouseY+offset);
  vertex(tailWidth/2+mouseX,arrowLegth+mouseY+offset);
  vertex(tailWidth/2+mouseX,arrowLegth+tailLength+mouseY+offset);
  vertex(-tailWidth/2+mouseX,arrowLegth+tailLength+mouseY+offset);
  vertex(-tailWidth/2+mouseX,arrowLegth+mouseY+offset);
  vertex(-arrowWidth/2+mouseX,arrowLegth+mouseY+offset);
  endShape(CLOSE);
  
  beginShape();
  vertex(mouseX,-(offset)+mouseY);
  vertex(arrowWidth/2+mouseX,-(arrowLegth+offset)+mouseY);
  vertex(tailWidth/2+mouseX,-(arrowLegth+offset)+mouseY);
  vertex(tailWidth/2+mouseX,-(arrowLegth+tailLength+offset)+mouseY);
  vertex(-tailWidth/2+mouseX,-(arrowLegth+tailLength+offset)+mouseY);
  vertex(-tailWidth/2+mouseX,-(arrowLegth+offset)+mouseY);
  vertex(-arrowWidth/2+mouseX,-(arrowLegth+offset)+mouseY);
  endShape(CLOSE);

  beginShape();
  vertex(-(offset)+mouseX,mouseY);
  vertex(-(arrowLegth+offset)+mouseX,arrowWidth/2+mouseY);
  vertex(-(arrowLegth+offset)+mouseX, tailWidth/2+mouseY);
  vertex(-(arrowLegth+tailLength+offset)+mouseX, tailWidth/2+mouseY);
  vertex(-(arrowLegth+tailLength+offset)+mouseX, -tailWidth/2+mouseY);
  vertex(-(arrowLegth+offset)+mouseX, -tailWidth/2+mouseY);
  vertex(-(arrowLegth+offset)+mouseX, -arrowWidth/2+mouseY);
  endShape(CLOSE);

  beginShape();
  vertex((offset)+mouseX,mouseY);
  vertex((arrowLegth+offset)+mouseX,arrowWidth/2+mouseY);
  vertex((arrowLegth+offset)+mouseX, tailWidth/2+mouseY);
  vertex((arrowLegth+tailLength+offset)+mouseX, tailWidth/2+mouseY);
  vertex((arrowLegth+tailLength+offset)+mouseX, -tailWidth/2+mouseY);
  vertex((arrowLegth+offset)+mouseX, -tailWidth/2+mouseY);
  vertex((arrowLegth+offset)+mouseX, -arrowWidth/2+mouseY);
  endShape(CLOSE);
  
  stroke(255,100);
  ellipse(mouseX, mouseY, pointSize, pointSize);
}

/*
// dynamically adjust the canvas to the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
*/


