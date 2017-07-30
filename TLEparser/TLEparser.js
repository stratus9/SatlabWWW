var meter;
var TLE;
var TLEinput = [];
var TLE_1line = [];
var TLE_2line = [];
var TLE_3line = [];
var TLEsplitted = [];

var DOM_satName;
var DOM_satNumber;
var DOM_satClass;
var DOM_satLaunchYear;
var DOM_satLaunchNumber;
var DOM_satEpochYear;
var DOM_satEpochDay;
var DOM_sat1DerivMeanMotion;
var DOM_sat2DerivMeanMotion;
var DOM_satBSTARdrag;
var DOM_satElementNumber;
var DOM_satCheckSum1;

var DOM_satInclination;
var DOM_satRightAscension;
var DOM_satEccentricity;
var DOM_satArgumentOfPerigee;
var DOM_MeanAnomaly;
var DOM_satMeanMotion;

var newTLE;

var almanach;
var objectsList;
var updateObjectButton;

function preload() {
	meter = new FPSMeter({
		top: '10px',
		theme: 'colorful'
	});
	TLE = "ISS (ZARYA)\n1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927\n2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537"
	newTLE = loadStrings('stations.tle');

	almanach = new Almanach();
	almanach.loadTLE('stations.tle');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	print(almanach.objectsList);
	almanach.parseTLE();
	print(almanach.objectsList);

	objectsList = createSelect();
	objectsList.position(650, 100);
	for (var i = 0; i < almanach.objectsList.length; i++) {
		objectsList.option(almanach.objectsList[i].satName, i);
	}

	updateObjectButton = createButton('Load...');
	updateObjectButton.position(650, 140);
	updateObjectButton.mousePressed(onButtonUpdateObjectData);


	TLE_1line = createInput();
	TLE_2line = createInput();
	TLE_3line = createInput();
	setOutputText(TLE_1line, 20, 120, 75);
	setOutputText(TLE_2line, 20, 150, 75);
	setOutputText(TLE_3line, 20, 180, 75);

	TLEsplitted = breakLines(TLE);
	print(TLEsplitted);
	TLE_1line.value(TLEsplitted[0]);
	TLE_2line.value(TLEsplitted[1]);
	TLE_3line.value(TLEsplitted[2]);

	DOM_satName = createInput();
	DOM_satNumber = createInput();
	DOM_satClass = createInput();
	DOM_satLaunchYear = createInput();
	DOM_satLaunchNumber = createInput();
	DOM_satEpochYear = createInput();
	DOM_satEpochDay = createInput();
	DOM_sat1DerivMeanMotion = createInput();
	DOM_sat2DerivMeanMotion = createInput();
	DOM_satBSTARdrag = createInput();
	DOM_satElementNumber = createInput();

	setOutputText(DOM_satName, 20, 250, 15);
	setOutputText(DOM_satNumber, 20, 280, 15);
	setOutputText(DOM_satClass, 20, 310, 15);
	setOutputText(DOM_satLaunchYear, 20, 340, 15);
	setOutputText(DOM_satLaunchNumber, 20, 370, 15);
	setOutputText(DOM_satEpochYear, 20, 400, 15);
	setOutputText(DOM_satEpochDay, 20, 430, 15);
	setOutputText(DOM_sat1DerivMeanMotion, 20, 460, 15);
	setOutputText(DOM_sat2DerivMeanMotion, 20, 490, 15);
	setOutputText(DOM_satBSTARdrag, 20, 520, 15);
	setOutputText(DOM_satElementNumber, 20, 550, 15);


	DOM_satInclination = createInput();
	DOM_satRightAscension = createInput();
	DOM_satEccentricity = createInput();
	DOM_satArgumentOfPerigee = createInput();
	DOM_MeanAnomaly = createInput();
	DOM_satMeanMotion = createInput();


	setOutputText(DOM_satInclination, 650, 250, 15);
	setOutputText(DOM_satRightAscension, 650, 280, 15);
	setOutputText(DOM_satEccentricity, 650, 310, 15);
	setOutputText(DOM_satArgumentOfPerigee, 650, 340, 15);
	setOutputText(DOM_MeanAnomaly, 650, 370, 15);
	setOutputText(DOM_satMeanMotion, 650, 400, 15);

	satValuesRefresh();
}

function draw() {
	meter.tick();
	background(100);
	text(TLE, 20, 70);
	text("Satellite name", 150, 265);
	text("Satellite number", 150, 295);
	text("Classification (U=Unclassified)", 150, 325);
	text("International Designator (Last two digits of launch year)", 150, 355);
	text("International Designator (Launch number of the year)", 150, 385);

	text("Epoch Year (last two digits of year)", 150, 415);
	text("Epoch (day of the year and fractional portion of the day)", 150, 445);
	text("First Time Derivative of the Mean Motion divided by two", 150, 475);
	text("Second Time Derivative of Mean Motion divided by six (decimal point assumed)", 150, 505);
	text("BSTAR drag term (decimal point assumed)", 150, 535);
	text("Element set number. Incremented when a new TLE is generated for this object.  ", 150, 565);

	text("Inclination (degrees)", 780, 265);
	text("Right ascension of the ascending node (degrees)", 780, 295);
	text("Eccentricity (decimal point assumed)", 780, 325);
	text("Argument of perigee (degrees)", 780, 355);
	text("Mean Anomaly (degrees)", 780, 385);
	text("Mean Motion (revolutions per day)", 780, 415);
}

function setOutputText(name, x, y, length) {
	name.position(x, y);
	name.attribute('disabled', 'true');
	name.attribute('size', String(length));
	name.style('font-family', 'monospace');
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function breakLines(text) {
	lines = text.split('\n');

	return lines;
}

function year2LongYear(value) {
	if (Number(value) > 50) return String('19' + value);
	else return String('20' + value);
}

function TLEdecimalToNumber(value) {
	for (var i = value.length; i > 1; i--) {
		if (value[i] == '-') {
			value = value.slice(0, i) + 'e' + value.slice(i);
			break;
		}
	}
	return Number(value);
}

function SatObject() {
	this.satName;
	this.satNumber;
	this.satClass;
	this.satLaunchYear;
	this.satLaunchNumber;
	this.satEpochYear;
	this.satEpochDay;
	this.sat1DerivMeanMotion;
	this.sat2DerivMeanMotion;
	this.satBSTARdrag;
	this.satElementNumber;
	this.satCheckSum1;
	this.satInclination;
	this.satRightAscension;
	this.satEccentricity;
	this.satArgumentOfPerigee;
	this.satMeanAnomaly;
	this.satMeanMotion;

	this.year2LongYear = function (value) {
		if (Number(value) > 50) return String('19' + value);
		else return Number(String('20' + value));
	}

	this.parseTLEsingle = function (line1, line2, line3) {
		this.satName = this.trimStringSpaces(line1);
		this.satNumber = Number(line2.slice(2, 6));
		this.satClass = line2.slice(7, 8);
		this.satLaunchYear = this.year2LongYear(line2.slice(9, 11));
		this.satLaunchNumber = Number(line2.slice(11, 14));
		this.satEpochYear = this.year2LongYear(line2.slice(18, 20));
		this.satEpochDay = this.TLEdecimalToNumber(line2.slice(20, 32));
		this.sat1DerivMeanMotion = this.TLEdecimalToNumber(line2.slice(33, 43));
		this.sat2DerivMeanMotion = this.TLEdecimalToNumber(line2.slice(44, 52));
		this.satBSTARdrag = this.TLEdecimalToNumber(line2.slice(53, 61));
		this.satElementNumber = this.TLEdecimalToNumber(line2.slice(64, 68));

		this.satInclination = this.TLEdecimalToNumber(line3.slice(8, 16));
		this.satRightAscension = this.TLEdecimalToNumber(line3.slice(17, 25));
		this.satEccentricity = this.TLEdecimalToNumber(line3.slice(26, 33));
		this.satArgumentOfPerigee = this.TLEdecimalToNumber(line3.slice(34, 42));
		this.satMeanAnomaly = this.TLEdecimalToNumber(line3.slice(43, 51));
		this.satMeanMotion = this.TLEdecimalToNumber(line3.slice(52, 63));
	}

	this.checkSum = function (string) {

	}

	this.TLEdecimalToNumber = function (value) {
		for (var i = value.length; i > 1; i--) {
			if (value[i] == '-') {
				value = value.slice(0, i) + 'e' + value.slice(i);
				break;
			}
		}
		return Number(value);
	}

	this.trimStringSpaces = function (str) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
}

function Almanach() {
	this.objectsList = [];
	this.TLE = [];
	this.TLEready = false;
	this.currentObject = 0;

	this.currentObjectData = function () {
		if (isNaN(this.currentObject)) return this.objectsList[0];
		else return this.objectsList[this.currentObject];
	}

	this.parseTLE = function () {
		var i = 0;
		while (i + 2 < this.TLE.length) {
			var tmp = new SatObject();
			tmp.parseTLEsingle(this.TLE[i], this.TLE[i + 1], this.TLE[i + 2]);
			this.objectsList.push(tmp);
			i += 3;
		}
	}

	this.TLEloaded = function (result) {
		this.TLEready = true;
		print('TLE loaded!');
	}

	this.loadTLE = function (url) {
		this.TLEready = false;
		print('TLE loading...');
		this.TLE = loadStrings(url, this.TLEloaded);
	}
}

function mousePressed() {

}

function onButtonUpdateObjectData() {
	almanach.currentObject = objectsList.value();
	satValuesRefresh();
}

function satValuesRefresh() {
	DOM_satName.value(almanach.objectsList[almanach.currentObject].satName);
	DOM_satNumber.value(almanach.objectsList[almanach.currentObject].satNumber);
	DOM_satClass.value(almanach.objectsList[almanach.currentObject].satClass);
	DOM_satLaunchYear.value(almanach.objectsList[almanach.currentObject].satLaunchYear);
	DOM_satLaunchNumber.value(almanach.objectsList[almanach.currentObject].satLaunchNumber);
	DOM_satEpochYear.value(almanach.objectsList[almanach.currentObject].satEpochYear);
	DOM_satEpochDay.value(almanach.objectsList[almanach.currentObject].satEpochDay);
	DOM_sat1DerivMeanMotion.value(almanach.objectsList[almanach.currentObject].sat1DerivMeanMotion);
	DOM_sat2DerivMeanMotion.value(almanach.objectsList[almanach.currentObject].sat2DerivMeanMotion);
	DOM_satBSTARdrag.value(almanach.objectsList[almanach.currentObject].satBSTARdrag);
	DOM_satElementNumber.value(almanach.objectsList[almanach.currentObject].satElementNumber);

	DOM_satInclination.value(almanach.objectsList[almanach.currentObject].satInclination);
	DOM_satRightAscension.value(almanach.objectsList[almanach.currentObject].satRightAscension);
	DOM_satEccentricity.value(almanach.objectsList[almanach.currentObject].satEccentricity);
	DOM_satArgumentOfPerigee.value(almanach.objectsList[almanach.currentObject].satArgumentOfPerigee);
	DOM_MeanAnomaly.value(almanach.objectsList[almanach.currentObject].satMeanAnomaly);
	DOM_satMeanMotion.value(almanach.objectsList[almanach.currentObject].satMeanMotion);
}
