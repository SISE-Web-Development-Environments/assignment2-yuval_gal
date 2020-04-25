var context;
var shape = new Object();
var board;
var score;
var Killed;
var pac_color;
var start_time;
var time_elapsed;
var backroundSound;
var pillSound;
var eatSound;
var hitSound;
var interval;
var maxFood;
var keyUp;
var keyDown;
var keyLeft;
var keyRight;
var maximumTime;

var wallImage;
var pillImage;
var lastKeyPressed;
var pill;
var pacmangirl;
var pacmangirlup;
var pacmangirldown;
var pacmangirlright;
var restart;
var numOfGhost;
var ghostImage;
var eatGhost;
var cnt;
var food_remain;
var pacman_remain;
var applesArray;
var pillsArray;
var ghostArray;
var lastGhostMovementTime;
var moreWalls;

const ghost = {
	rowIndex: 0,
	colIndex: 0,
	lastRow: 0,
	lastCol: 0,

};

const dave = {
	rowIndex: 0,
	colIndex: 0,
	lastRow: 0,
	lastCol: 0,

};

$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});

function setSettingVars(maxTime, numOfEatableBalls, numOfGhosts, colorLightBalls, colorMedBalls, colorHeavyBalls, chosenUp,
						chosenDown, chosenLeft, chosenRight) {

	maxFood = numOfEatableBalls;
	keyUp = chosenUp;
	keyDown = chosenDown;
	keyLeft = chosenLeft;
	keyRight = chosenRight;
	maximumTime = maxTime;
	numOfGhost = numOfGhosts;


	window.focus();
	Start();
}

function initializeImages() {
	wallImage = new Image();
	wallImage.src = "images/walls.PNG";
	pillImage = new Image();
	pillImage.src = "images/pill.png";
	pacmangirl = new Image();
	pacmangirl.src = "images/pacmangirl.png";
	pacmangirldown = new Image();
	pacmangirldown.src = "images/pacmangirldown.png";
	pacmangirlup = new Image();
	pacmangirlup.src = "images/pacmangirlup.png";
	pacmangirlright = new Image();
	pacmangirlright.src = "images/pacmangirlright.png";
	ghostImage = new Image();
	ghostImage.src = "images/images.png";
}
function initializeAudio() {
	backroundSound = document.getElementById( "backroundSound" );
	hitSound = document.getElementById( "hitSound" );
	eatSound = document.getElementById("eatSound");
	pillSound = document.getElementById("pillSound");
	eatGhost = document.getElementById("eatGhost");
}
function initializeParameters() {
	lastKeyPressed ="NOKEY"; // Note-start game no key pressed
	Killed = 5; // initial number of Killed
	pill=3;
	moreWalls=9;
	//TODO: remove this line after starting to use the settings values
	numOfGhost=4;
	score = 0;
	board = [];
	applesArray = [];
	pillsArray = [];
	ghostArray = new Array(numOfGhost);
	cnt = 100;
	food_remain = maxFood;
	pacman_remain = 1;
	restart = document.getElementById("restartBtn");
	restart.addEventListener("click",gameRestart);
	start_time = new Date();
	lastGhostMovementTime = new Date();
}

function drawGhost() {
	var ghostToIterate = numOfGhost;
	while (ghostToIterate > 0) {
		var emptycellforGhost = findRandomEmptyCell(board);
		board[emptycellforGhost[0]][emptycellforGhost[1]] = 8;
		ghostArray[ghostToIterate-1] = Object.create(ghost);
		ghostArray[ghostToIterate-1].rowIndex = emptycellforGhost[0];
		ghostArray[ghostToIterate-1].colIndex = emptycellforGhost[1];
		ghostToIterate--;
	}
}

function Start() {
	if(localStorage.getItem("should_begin") == "true") {
		initializeImages();
		initializeAudio();
		initializeParameters();

		for (var i = 0; i < 10; i++) {
			board[i] = new Array();
			applesArray[i] = new Array();
			pillsArray[i] = new Array();
			//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
			for (var j = 0; j < 10; j++) {
				if (
					(i == 3 && j == 3) ||
					(i == 3 && j == 4) ||
					(i == 3 && j == 5) ||
					(i == 6 && j == 1) ||
					(i == 6 && j == 2)
				) {
					board[i][j] = 4; ////Walls
					applesArray[i][j] = 0;
					pillsArray[i][j] = 0;
				} else {
					var randomNum = Math.random();
					if (randomNum <= (1.0 * food_remain) / cnt) {
						food_remain--;
						board[i][j] = 1; //Food
						applesArray[i][j] = 1;
						pillsArray[i][j] = 0;
					} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
						shape.i = i;
						shape.j = j;
						pacman_remain--;
						board[i][j] = 2; //Pacman
						applesArray[i][j] = 0;
						pillsArray[i][j] = 0;
					} else {
						board[i][j] = 0; //Empty cells
						applesArray[i][j] = 0;
						pillsArray[i][j] = 0;
					}
					cnt--;
				}
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		applesArray[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	while (pill>0){
		var emptycellforpill = findRandomEmptyCell(board);
		board[emptycellforpill[0]][emptycellforpill[1]] = 7;
		pillsArray[emptycellforpill[0]][emptycellforpill[1]] = 1;
		pill--;
	}
	while (moreWalls>0){
		var emptycellformoreWalls = findRandomEmptyCell(board);
		board[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 4;
		applesArray[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 0;
		pillsArray[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 0;
		moreWalls--;
	}
	drawGhost();
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		lastKeyPressed="UP";
		return 1;
	}
	if (keysDown[40]) {
		lastKeyPressed="DOWN";
		return 2;
	}
	if (keysDown[37]) {
		lastKeyPressed="LEFT";
		return 3;
	}
	if (keysDown[39]) {
		lastKeyPressed="RIGHT";
		return 4;
	}
}

function Draw() {
	// backroundSound.play();
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblKilled.value = Killed;
	userN.value = currentUser;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //Draw pacman
				if (lastKeyPressed == "UP") { //WHERE TO PUT THE EYE OF PACMAN
					context.drawImage(pacmangirlup,center.x -30,center.y-30,60,60);
				} else if (lastKeyPressed == "LEFT") {
					context.drawImage(pacmangirl,center.x -30,center.y-30,60,60);
				} else if (lastKeyPressed == "DOWN") {
					context.drawImage(pacmangirldown,center.x -30,center.y-30,60,60);
				} else if(lastKeyPressed =="RIGHT"){
					context.drawImage(pacmangirlright,center.x -30,center.y-30,60,60);
				}
				else if(lastKeyPressed =="NOKEY"){
					context.drawImage(pacmangirl,center.x -30,center.y-30,60,60);
				}

			} else if (board[i][j] == 1) { //Draw food
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.drawImage(wallImage,center.x - 30,center.y - 30,60,60);
			}
			else if(board[i][j] == 7){
				context.drawImage(pillImage,center.x - 30,center.y - 30,60,60);
			}
			else if(board[i][j] == 8){
				context.drawImage(ghostImage,center.x - 30,center.y - 30,60,60);
			}
		}
	}
}

function gameRestart(){
	Start();
}


function checkApplesOrPills(rowIndex, colIndex) {
	if(applesArray[rowIndex][colIndex] === 1)
	{
		board[rowIndex][colIndex] = 1;
	}
	else if(pillsArray[rowIndex][colIndex] === 1)
	{
		board[rowIndex][colIndex] = 7;
	}
	else
	{
		board[rowIndex][colIndex] = 0;
	}
}

function chooseRandomMovement(characterToMakeMove) {
	var isLegal = false;
	var rowIndex = characterToMakeMove.rowIndex;
	var colIndex = characterToMakeMove.colIndex;
	var randomGhostMove = 0;
	var countTries = 5;
	while (!isLegal) {
		randomGhostMove = Math.random();
		if(countTries === 0)
		{
			characterToMakeMove.lastRow = 0;
			characterToMakeMove.lastCol = 0;

		}

		if (randomGhostMove < 0.25) {
			if (rowIndex > 0 && board[rowIndex - 1][colIndex] !== 4 && characterToMakeMove.lastRow !== (rowIndex-1)) {//Up
				if(board[rowIndex - 1][colIndex] === 2)
				{
					hitThePacman();
				}
				board[rowIndex - 1][colIndex] = 8;
				checkApplesOrPills(rowIndex,colIndex);
				characterToMakeMove.lastRow = rowIndex;
				characterToMakeMove.rowIndex -= 1;
				return;
			}
		} else if (rowIndex < 9 && randomGhostMove >= 0.25 && randomGhostMove < 0.5 && characterToMakeMove.lastRow !== (rowIndex+1)) {//Down
			if (board[rowIndex + 1][colIndex] !== 4) {
				if(board[rowIndex + 1][colIndex] === 2)
				{
					hitThePacman();
				}
				board[rowIndex + 1][colIndex] = 8;
				checkApplesOrPills(rowIndex,colIndex);
				characterToMakeMove.lastRow = rowIndex;
				characterToMakeMove.rowIndex += 1;
				return;
			}
		} else if (colIndex > 0 && randomGhostMove >= 0.5 && randomGhostMove < 0.75 && characterToMakeMove.lastCol !== (colIndex-1)) {//Left
			if (board[rowIndex][colIndex - 1] !== 4) {
				if(board[rowIndex][colIndex - 1] === 2)
				{
					hitThePacman();
				}
				board[rowIndex][colIndex - 1] = 8;
				checkApplesOrPills(rowIndex,colIndex);
				characterToMakeMove.lastCol = colIndex;
				characterToMakeMove.colIndex -= 1;
				return;
			}
		} else if (colIndex < 9 && randomGhostMove >= 0.75 && randomGhostMove < 1 && characterToMakeMove.lastCol !== (colIndex+1)) {//Right
			if (board[rowIndex][colIndex + 1] !== 4) {
				if(board[rowIndex][colIndex + 1] === 2)
				{
					hitThePacman();
				}
				board[rowIndex][colIndex + 1] = 8;
				checkApplesOrPills(rowIndex,colIndex);
				characterToMakeMove.lastCol = colIndex;
				characterToMakeMove.colIndex += 1;
				return;
			}
		}
		countTries--;
	}
}



function moveGhostsRandomly() {
	var countGhosts = 0;
	while (countGhosts < numOfGhost)
	{
		// console.log("What the hell");
		// var ghostIndexes = getGhostIndexes();
		// if(ghostIndexes === 0)
		// {
		// 	console.error("Something Went Wrong finding the " + (countGhosts+1) + " ghost");
		// 	return;
		// }
		chooseRandomMovement(ghostArray[countGhosts]);
		countGhosts++;
	}
}

function hitThePacman() {
	Killed--;
	eatGhost.play();
	score=score-10;
}

function UpdatePosition() {
	if(localStorage.getItem("should_begin") == "true") {
		var ghostMoveTime = new Date();
		var ghost_time_elapsed = (ghostMoveTime - lastGhostMovementTime) / 1000;
		if(ghost_time_elapsed > 1)
		{
			moveGhostsRandomly();
			lastGhostMovementTime = new Date();
		}


		board[shape.i][shape.j] = 0;
		var x = GetKeyPressed();
		if (x == 1) {
			if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
				if(board[shape.i][shape.j - 1] == 7){
					Killed = Killed+1;
					pillSound.play();
					pillsArray[shape.i][shape.j] = 0;
				}
				lastKeyPressed="UP";
				shape.j--;
			}
		}
		if (x == 2) {
			if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
				if(board[shape.i][shape.j + 1] == 7){
					Killed = Killed+1;
					pillSound.play();
					pillsArray[shape.i][shape.j] = 0;
				}
				lastKeyPressed="DOWN";
				shape.j++;

			}
		}
		if (x == 3) {
			if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
				if(board[shape.i - 1][shape.j] == 7){
					Killed = Killed+1;
					pillSound.play();
					pillsArray[shape.i][shape.j] = 0;
				}
				lastKeyPressed="LEFT";
				shape.i--;
			}
		}
		if (x == 4) {
			if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
				if(board[shape.i + 1][shape.j] == 7){
					Killed = Killed+1;
					pillSound.play();
					pillsArray[shape.i][shape.j] = 0;
				}
				lastKeyPressed="RIGHT";
				shape.i++;
			}
		}
		if (board[shape.i][shape.j] == 1) { // This is the score of 5 points balls!!!!!
			score=score+5;
			eatSound.play();
			applesArray[shape.i][shape.j] = 0;
		}
		if (board[shape.i][shape.j] == 8) { // This is the score of 5 points balls!!!!!
			hitThePacman();
		}
		board[shape.i][shape.j] = 2; // The location of the pacman
		var currentTime = new Date();
		time_elapsed = (currentTime - start_time) / 1000;
		if (score >= 20 && time_elapsed <= 10) { //AFTER THIS THE PACMAN IS PINK -NOTE TO AND!!!
			//pac_color = "pink";
		}
		// if (score == 50) { //NEED TO CHANGE ACOORDING THE ASS.2
		// 	window.clearInterval(interval);
		// 	window.alert("Game completed");
		// } else {
		// 	Draw();
		// }
		if(time_elapsed >= maximumTime)
		{
			window.clearInterval(interval);
			window.alert("Game Over! Time is up");
			return;
		}
		else {
			if (score == 50) {
				window.clearInterval(interval);
				window.alert("Game completed");
			} else {
				Draw();
			}
		}



	}
}
