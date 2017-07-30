var template;
var pythonCode;
var pythonCodeInput;

var buttonClear;
var buttonExe;


function preload() {

	template = "import random\nguesses_made = 0\nname = raw_input('Hello! What is your name?')\nnumber = random.randint(1, 20)\nprint 'Well, {0}, I am thinking of a number between 1 and 20.'.format(name)\nwhile guesses_made < 6:\n\n    guess = int(raw_input('Take a guess: '))\n    guesses_made += 1\n    if guess < number:\n        print 'Your guess is too low.'\n    if guess > number:\n        print 'Your guess is too high.'\n    if guess == number:\n        break\nif guess == number:\n    print 'Good job, {0}! You guessed my number in {1} guesses!'.format(name, guesses_made)\nelse:\n    print 'Nope. The number I was thinking of was {0}'.format(number)";
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	pythonCodeInput = createElement('textarea', template);
	setInputTextarea(pythonCodeInput, 0, 25, windowWidth, windowHeight - 25);

	buttonClear = createButton('Clear');
	buttonExe = createButton('Execute');

	buttonClear.position(windowWidth / 2, 0);
	buttonExe.position(0, 0);

	buttonClear.mousePressed(clearTextarea);
	buttonExe.mousePressed(executePython);
}

function draw() {
	background(255);
	text("Satellite name", 0, 0);
}

function setOutputText(name, x, y, length) {
	name.position(x, y);
	name.attribute('disabled', 'true');
	name.attribute('size', String(length));
	name.style('font-family', 'monospace');
}

function setInputTextarea(name, x, y, width, height) {
	name.position(x, y);
	name.style('width', String(width));
	name.style('height', String(height));
	name.style('resize', 'none');
	name.style('font-family', 'monospace');
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setInputTextarea(pythonCodeInput, 0, 20, windowWidth, windowHeight - 20);
	buttonClear.position(windowWidth / 2, 0);
}

function mousePressed() {

}

function onButtonUpdateObjectData() {
	almanach.currentObject = objectsList.value();
	satValuesRefresh();
}

function clearTextarea() {
	pythonCodeInput.value(template);
}

function executePython() {

}
