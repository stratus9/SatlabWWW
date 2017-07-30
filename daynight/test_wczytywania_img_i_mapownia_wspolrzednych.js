var sensorData;
var img;
var dayNight_B = [];
var dayNight_L = [];
var dayNight_delta = 0;
var dayNight_time = 0;
var dayNight_l;
var dayNight_b;
var terminator = [];

var domTime;

var daySlider;

//var meter;

//ref: http://aa.quae.nl/en/antwoorden/zonpositie.html#v526

function preload() {
  //img = loadImage('water_8k.png');
  img = loadImage('PathfinderMap.jpg');
}

function setup() {
  img.loadPixels();
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  // meter = new FPSMeter({
  //   top: '100px',
  //   theme: 'colorful'
  // });

  //daySlider = createSlider(0, 364, 100);
  //daySlider.position(20, 40);

  domTime = createInput();
  domTime.position(20, 20);
  domTime.attribute('disabled', 'true');
  domTime.attribute('size', '30');
  domTime.style('font-family', 'monospace');

  angleMode(DEGREES);
}

function draw() {
  //meter.tick();
  sensorData = parent.newSensorData;
  if (typeof sensorData != 'undefined') {
    image(img, 0, 0, windowWidth, windowHeight);

    //Rysuj równik
    push();
    stroke(200, 100);
    line(0, windowHeight / 2, windowWidth, windowHeight / 2);
    pop();

    //Rysuj Kraków
    var y = map(50, -90, 90, windowHeight, 0);
    var x = map(-20, -180, 180, windowWidth, 0);
    stroke(200, 100, 0);
    fill(50, 250, 200);
    ellipse(x, y, 10);

    //Napisz Kraków
    fill(255, 200);
    noStroke();
    textSize(10);
    text("Kraków", x + 10, y + 10);

    //Licz terminator
    if (1 /*frameCount%5 == 0*/ ) {
      var dayOfTheYear = sensorData.calendar.dayOfTheYear;
      var dayNight_M = -3.6 + 0.9856 * dayOfTheYear;
      var dayNight_v = dayNight_M + 1.9 * sin(dayNight_M);
      var dayNight_lambda = dayNight_v + 102.9;
      dayNight_delta = 22.8 * sin(dayNight_lambda) + 0.6 * pow(sin(dayNight_lambda), 3);

      dayNight_time = sensorData.calendar.seconds / 3600 + sensorData.calendar.minutes / 60 + sensorData.calendar.hours;
      dayNight_time = dayNight_time % 24; //dayNight_time%24;

      dayNight_l = -15 * (dayNight_time);
      //dayNight_l = 50;
      dayNight_b = -dayNight_delta; //zrobić
      for (var i = 0; i <= 360; i++) {
        dayNight_B[i] = asin(cos(dayNight_b) * sin(i));
        var dayNight_x = -cos(dayNight_l + 90) * sin(dayNight_b) * sin(i) - sin(dayNight_l + 90) * cos(i);
        var dayNight_y = -sin(dayNight_l + 90) * sin(dayNight_b) * sin(i) + cos(dayNight_l + 90) * cos(i);
        dayNight_L[i] = atan2(dayNight_x, dayNight_y);
      }
    }

    //Licz terminator
    terminator.splice(0, terminator.length);
    var terminator_x;
    var terminator_y;
    for (var i = 0; i < dayNight_B.length; i++) {
      terminator_y = map(-dayNight_B[i], -90, 90, windowHeight, 0);
      terminator_x = map(dayNight_L[i], -180, 180, windowWidth, 0);
      terminator.push(createVector(terminator_x, terminator_y));
    }

    //Rysuj Słońce
    push();
    stroke(250, 0, 0);
    fill(250, 250, 0);
    var angleSun = (dayNight_l + 180) % 360;
    var sunX = ((-angleSun + 180) % 360) - 180;
    y = map(dayNight_b, -90, 90, windowHeight, 0);
    x = map(sunX, -180, 180, windowWidth, 0);
    ellipse(x, y, 50);
    pop();

    //Sortuj współrzędne
    terminator.sort(function(a, b) {
      return a.x - b.x;
    });

    //Rysuj terminator
    /*
    push();
    stroke(250,0,0);
    fill(30,50);
    for(var i=0; i<terminator.length; i++){
      ellipse(terminator[i].x, terminator[i].y, 10);
    }
    pop();
    */
    push();
    noFill();
    stroke(50, 200);
    strokeWeight(4);
    beginShape();
    vertex(0, terminator[0].y);
    vertex(0, terminator[0].y);
    for (var i = 0; i < terminator.length; i++) {
      curveVertex(terminator[i].x, terminator[i].y);
    }
    vertex(windowWidth, terminator[terminator.length - 1].y);
    vertex(windowWidth, terminator[terminator.length - 1].y);
    endShape();
    pop();

    //Rysuj cień
    if (terminator.length > 1) {
      push();
      stroke(0, 0);
      fill(10, 190);
      var dir = 0;
      if (dayNight_delta < 0) dir = windowHeight;
      beginShape();
      vertex(0, dir);
      vertex(0, terminator[0].y);
      for (var i = 0; i < terminator.length; i++) {
        vertex(terminator[i].x, terminator[i].y);
      }
      vertex(windowWidth, terminator[terminator.length - 1].y);
      vertex(windowWidth, dir);
      endShape();
      pop();
    }

    //wypisz datę i czas UTC nad suwakiem
    domTime.value(dateFromDay(sensorData.calendar.year, sensorData.calendar.dayOfTheYear) + " UTC" + ("0" + floor(sensorData.calendar.hours)).slice(-2) + ":" + ("0" + floor(sensorData.calendar.minutes)).slice(-2) + ":" + ("0" + floor(sensorData.calendar.seconds)).slice(-2));
    //console.log(SensorData.calendar);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  //print(dateFromDay(2017, daySlider.value() + 1)); // "Thu Oct 28 2010", today ;)
}

function dateFromDay(year, day) {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  date.setTime(1);
  date.setDate(day);
  date.setYear(year);
  var dateString = String('0' + date.getDate()).slice(-2) + String(' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + '           ').substring(0, 15);
  return dateString; // add the number of days
}
