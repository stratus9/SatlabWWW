var sensorData;

var DOM_BatteryVoltage;
var DOM_CoilXCurrent;
var DOM_CoilYCurrent;
var DOM_CoilZCurrent;
var DOM_BatteryLevel;
var DOM_Status;
var DOM_SignalStrength;
var DOM_MagX;
var DOM_MagY;
var DOM_MagZ;
var DOM_GyroX;
var DOM_GyroY;
var DOM_GyroZ;
var DOM_AccelX;
var DOM_AccelY;
var DOM_AccelZ;


var DOM_LabelMag;
var DOM_LabelBattLevel;
var DOM_LabelStatus;
var DOM_LabelCoilsCurrent;
var DOM_LabelBatVoltage;
var DOM_LabelGyro;
var DOM_LabelAccel;

var outputRasterX;
var outputRasterY;

function preload() {}

function setup() {
  var width = windowWidth;
  var height = 120;
  createCanvas(width, height);
  //background(200);
  outputRasterX = width / 6;
  outputRasterY = height / 5;
  frameRate(2);

  DOM_BatteryVoltage = createOutputText(0, outputRasterY, 8, 'right');
  DOM_CoilXCurrent = createOutputText(outputRasterX, outputRasterY, 11, 'right');
  DOM_CoilYCurrent = createOutputText(outputRasterX, outputRasterY * 2, 11, 'right');
  DOM_CoilZCurrent = createOutputText(outputRasterX, outputRasterY * 3, 11, 'right');
  DOM_BatteryLevel = createOutputText(0, outputRasterY * 3, 8, 'right');
  DOM_Status = createOutputText(outputRasterX * 3, outputRasterY, 8, 'center');
  setOutputBold(DOM_Status);
  DOM_MagX = createOutputText(outputRasterX * 5, outputRasterY, 11, 'right');
  DOM_MagY = createOutputText(outputRasterX * 5, outputRasterY * 2, 11, 'right');
  DOM_MagZ = createOutputText(outputRasterX * 5, outputRasterY * 3, 11, 'right');
  DOM_GyroX = createOutputText(outputRasterX * 2, outputRasterY * 1, 15, 'right');
  DOM_GyroY = createOutputText(outputRasterX * 2, outputRasterY * 2, 15, 'right');
  DOM_GyroZ = createOutputText(outputRasterX * 2, outputRasterY * 3, 15, 'right');
  DOM_AccelX = createOutputText(outputRasterX * 4, outputRasterY * 1, 15, 'right');
  DOM_AccelY = createOutputText(outputRasterX * 4, outputRasterY * 2, 15, 'right');
  DOM_AccelZ = createOutputText(outputRasterX * 4, outputRasterY * 3, 15, 'right');


  DOM_LabelBatVoltage = createTextLabel(outputRasterX * 0, 5, 12, 'left', "Batt voltage");
  DOM_LabelCoilsCurrent = createTextLabel(outputRasterX * 1, 5, 13, 'left', "Coils current");
  DOM_LabelBattLevel = createTextLabel(outputRasterX * 0, outputRasterY * 2 + 5, 12, 'left', "Batt level");
  DOM_LabelStatus = createTextLabel(outputRasterX * 3, 5, 12, 'left', "Status");
  DOM_LabelMag = createTextLabel(outputRasterX * 5, 5, 12, 'left', "Mag. field");
  DOM_LabelGyro = createTextLabel(outputRasterX * 2, 5, 12, 'left', "Rotation");
  DOM_LabelAccel = createTextLabel(outputRasterX * 4, 5, 12, 'left', "Acceleration");

}

function draw() {
  refreshValues();
  if (frameCount % 15 == 0) teleStatus = "RUN";
  if (frameCount % 15 == 5) teleStatus = "IDLE";
  if (frameCount % 15 == 10) teleStatus = "ERROR";
  //background(255);
}

function redrawBoxes() {
  setOutputPosition(DOM_BatteryVoltage, 0, outputRasterY);
  setOutputPosition(DOM_CoilXCurrent, outputRasterX, outputRasterY);
  setOutputPosition(DOM_CoilYCurrent, outputRasterX, outputRasterY * 2);
  setOutputPosition(DOM_CoilZCurrent, outputRasterX, outputRasterY * 3);
  setOutputPosition(DOM_BatteryLevel, 0, outputRasterY * 3);
  setOutputPosition(DOM_Status, outputRasterX * 3, outputRasterY);
  setOutputPosition(DOM_MagX, outputRasterX * 5, outputRasterY);
  setOutputPosition(DOM_MagY, outputRasterX * 5, outputRasterY * 2);
  setOutputPosition(DOM_MagZ, outputRasterX * 5, outputRasterY * 3);
  setOutputPosition(DOM_GyroX, outputRasterX * 2, outputRasterY * 1);
  setOutputPosition(DOM_GyroY, outputRasterX * 2, outputRasterY * 2);
  setOutputPosition(DOM_GyroZ, outputRasterX * 2, outputRasterY * 3);

  setOutputPosition(DOM_LabelBatVoltage, outputRasterX * 0, 5);
  setOutputPosition(DOM_LabelCoilsCurrent, outputRasterX * 1, 5);
  setOutputPosition(DOM_LabelBattLevel, outputRasterX * 0, outputRasterY * 2 + 5);
  setOutputPosition(DOM_LabelStatus, outputRasterX * 3, 5);
  setOutputPosition(DOM_LabelMag, outputRasterX * 5, 5);
  setOutputPosition(DOM_LabelGyro, outputRasterX * 2, 5);
}

function createTextLabel(x, y, length, align, label) {
  var output = createInput();
  output.position(x, y);
  output.attribute('readonly', 'true');
  output.attribute('type', 'text');
  output.attribute('size', String(length));
  output.style('font-family', 'monospace');
  output.style('text-align', align);
  //output.style('background', 'transparent');
  output.style('border', '0');

  output.value(label);
  return output;
}


function createOutputText(x, y, length, align) {
  var output = createInput();
  output.position(x, y);
  output.attribute('disabled', 'true');
  output.attribute('size', String(length));
  output.style('font-family', 'monospace');
  output.style('text-align', align);
  return output;
}

function setOutputPosition(name, x, y) {
  name.position(x, y);
}

function refreshValues() {
  sensorData = parent.newSensorData;
  if (typeof sensorData != 'undefined') {
    DOM_BatteryVoltage.value(String((sensorData.batteryVoltage).toFixed(2) + ' V'));
    DOM_CoilXCurrent.value(String('X: ' + ("    " + (sensorData.coilXCurrent).toFixed(0)).slice(-5) + ' mA'));
    DOM_CoilYCurrent.value(String('Y: ' + ("    " + (sensorData.coilYCurrent).toFixed(0)).slice(-5) + ' mA'));
    DOM_CoilZCurrent.value(String('Z: ' + ("    " + (sensorData.coilZCurrent).toFixed(0)).slice(-5) + ' mA'));
    DOM_BatteryLevel.value(String((sensorData.batteryLevel * 100).toFixed(0) + " %"));
    DOM_Status.value(String(sensorData.status));

    if (sensorData.status == "RUN") setOutputColor(DOM_Status, "green", "black");
    else if (sensorData.status == "IDLE") setOutputColor(DOM_Status, "yellow", "black");
    else setOutputColor(DOM_Status, "red", "white");

    DOM_MagX.value(String('X: ' + ("    " + (sensorData.magnetic.magX).toFixed(0)).slice(-5) + ' uT'));
    DOM_MagY.value(String('Y: ' + ("    " + (sensorData.magnetic.magY).toFixed(0)).slice(-5) + ' uT'));
    DOM_MagZ.value(String('Z: ' + ("    " + (sensorData.magnetic.magZ).toFixed(0)).slice(-5) + ' uT'));

    DOM_GyroX.value(String('X: ' + ("    " + (sensorData.omega.omega_x).toFixed(1)).slice(-6) + ' deg/s'));
    DOM_GyroY.value(String('Y: ' + ("    " + (sensorData.omega.omega_y).toFixed(1)).slice(-6) + ' deg/s'));
    DOM_GyroZ.value(String('Z: ' + ("    " + (sensorData.omega.omega_z).toFixed(1)).slice(-6) + ' deg/s'));

    DOM_AccelX.value(String('X: ' + ("    " + (sensorData.accel.accelX).toFixed(1)).slice(-6) + ' m/s2'));
    DOM_AccelY.value(String('Y: ' + ("    " + (sensorData.accel.accelY).toFixed(1)).slice(-6) + ' m/s2'));
    DOM_AccelZ.value(String('Z: ' + ("    " + (sensorData.accel.accelZ).toFixed(1)).slice(-6) + ' m/s2'));

  }
}

function setOutputColor(name, bgcolor, color) {
  name.style('background-color', String(bgcolor));
  name.style('color', String(color));
}

function setOutputBold(name) {
  name.style('font-weight', 'bold');
}

function windowResized() {
  var width = windowWidth;
  var height = 120;
  if (width < 800) width = 800;
  resizeCanvas(width, height);
  outputRasterX = width / 6;
  redrawBoxes();
}
