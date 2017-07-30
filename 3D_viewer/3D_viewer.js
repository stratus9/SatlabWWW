var sensorData;

var myModel;
//var meter;

var euler;

function preload() {
  myModel = loadModel('proto1.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(1);

  ambientLight(40);
  pointLight(150, 150, 150, 0, 0, -50);
  pointLight(150, 150, 120, 600, 200, 100);
  pointLight(50, 50, 60, 1000, 2000, 100);

  //specularMaterial(250);
  ambientMaterial(160);

  // meter = new FPSMeter({
  //   top: '10px',
  //   theme: 'colorful'
  // });
}

function draw() {
  sensorData = parent.newSensorData;
  //meter.tick();
  background(120, 120, 160);
  //rotateX(frameCount * 0.01);
  //rotateY(frameCount * 0.01);
  euler = quaterniontoEuler(sensorData.orient.q_a, sensorData.orient.q_b, sensorData.orient.q_c, sensorData.orient.q_d);
  rotateY(euler.y);
  rotateZ(euler.z);
  rotateX(euler.x);
  scale(1);
  model(myModel);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function quaterniontoEuler(x, y, z, w) {
  var heading, attitude, bank;
  var result = {
    x: 0,
    y: 0,
    z: 0
  };

  var test = x * y + z * w;
  if (test > 0.499) { // singularity at north pole
    heading = 2 * Math.atan2(x, w);
    attitude = Math.PI / 2;
    bank = 0;
  } else if (test < -0.499) { // singularity at south pole
    heading = -2 * Math.atan2(x, w);
    attitude = -Math.PI / 2;
    bank = 0;
  } else {
    var sqx = x * x;
    var sqy = y * y;
    var sqz = z * z;
    heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz); // Heading
    attitude = Math.asin(2 * test); // attitude
    bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz); // bank
  }
  result.y = heading;
  result.z = attitude;
  result.x = bank;
  return result;
};
