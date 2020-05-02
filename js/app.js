var context;
// var shape = new Object();
var board;
var score;
var Lives;
var start_time;
var time_elapsed;
var backgroundSound;
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
var clockImage;
var lastKeyPressed;
var pill;
var pacmangirl;
var pacmangirlup;
var pacmangirldown;
var pacmangirlright;
var restart;
var numOfGhost;
var ghostImage;
var daveImage;
var daveImageLeft;
var daveImageUp;
var daveImageDown;
var daveToDraw;
var shouldDrawDave;
var eatGhost;
var cnt;
var clock;
var food_remain;
var pacman_remain;
var applesArray;
var pillsArray;
var clockArray;
var ghostArray;
var lastGhostMovementTime;
var moreWalls;
var daveObject;
var pacmanObject;
var cLightBalls;
var cMedBalls;
var cHeavyBalls;
var pointsLightBalls;
var pointsMedBalls;
var pointsHeavyBalls;

var board_row_size;
var board_col_size;
var draw_size_x;
var draw_size_y;


const ghost = {
	rowIndex: 0,
	colIndex: 0,
	lastRow: 0,
	lastCol: 0,
	boardValue: 8,
	type: "ghost",
	hitThePacman() {
		Lives--;
		eatGhost.play();
		score=score-10;
		StartAfterKilled();
	},
};

const dave = {
	type: "dave",
	rowIndex: 0,
	colIndex: 0,
	lastRow: 0,
	lastCol: 0,
	boardValue: 11,
	hitThePacman() {
		pillSound.play();
		score=score+50;
		shouldDrawDave = false;
		this.rowIndex = -100;
		this.colIndex = -100;
	},
};

const pacman = {
	type: "pacman",
	rowIndex: 0,
	colIndex: 0,
	boardValue: 2,
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
	maximumTime = parseInt(maxTime);
	numOfGhost = numOfGhosts;
	cLightBalls = colorLightBalls;
	cMedBalls = colorMedBalls;
	cHeavyBalls= colorHeavyBalls;
	document.getElementById("canvas").focus();
	// window.focus();
	window.clearInterval(interval);
	initializeImages();
	initializeAudio();
	initializeParameters();
	Start();
}

function initializeImages() {
	wallImage = new Image();
	wallImage.src = "images/walls.png";
	clockImage = new Image();
	clockImage.src = "images/clock.png";
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
	daveImage = new Image();
	daveImage.src = "images/dave.png";
	daveImageLeft = new Image();
	daveImageLeft.src = "images/daveLeft.png";
	daveImageUp = new Image();
	daveImageUp.src = "images/daveUp.png";
	daveImageDown = new Image();
	daveImageDown.src = "images/daveDown.png";
	daveToDraw = daveImage;
	shouldDrawDave = true;

}
function initializeAudio() {
	backgroundSound = document.getElementById( "backroundSound" );
	hitSound = document.getElementById( "hitSound" );
	eatSound = document.getElementById("eatSound");
	pillSound = document.getElementById("pillSound");
	eatGhost = document.getElementById("eatGhost");
}
function initializeParameters() {
	lastKeyPressed ="NOKEY"; // Note-start game no key pressed
	Lives = 5; // initial number of Killed
	pill=3;
	clock=1;
	score = 0;
	pointsHeavyBalls = 25;
	pointsLightBalls = 5;
	pointsMedBalls = 15;
	board = [];
	board_row_size = 15;
	board_col_size = 15;
	moreWalls=Math.floor((Math.random()*(board_row_size+board_col_size))+10);
	cnt = board_row_size * board_col_size;
	canvas.width = 600;
	canvas.height = 600;
	draw_size_x = board_row_size*canvas.height/cnt;
	draw_size_y = board_col_size*canvas.width/cnt;
	clockArray = [];
	applesArray = [];
	pillsArray = [];
	ghostArray = new Array(numOfGhost);
	food_remain = maxFood;
	pacman_remain = 1;
	// restart = document.getElementById("restartBtn");
	// restart.addEventListener("click",gameRestart);
	start_time = new Date();
	lastGhostMovementTime = new Date();
}

function findNextEmptyCorner() {
	var maxRow = board.length -1;
	var maxCol = board[0].length -1;
	if(board[0][0] !== 4 && board[0][0] !== 8)
	{
		return [0,0];
	}
	if(board[0][maxCol] !== 4 && board[0][maxCol] !== 8)
	{
		return [0,maxCol];
	}
	if(board[maxRow][0] !== 4 && board[maxRow][0] !== 8)
	{
		return [maxRow,0];
	}
	if(board[maxRow][maxCol] !== 4 && board[maxRow][maxCol] !== 8)
	{
		return [maxRow,maxCol];
	}
	return undefined;
}

function putGhostsInBoard(isBegining) {
	var ghostToIterate = numOfGhost;
	while (ghostToIterate > 0) {
		if(!isBegining)
		{
			checkApplesOrPills(ghostArray[ghostToIterate-1].rowIndex,ghostArray[ghostToIterate-1].colIndex);
		}
		var emptycellforGhost = findNextEmptyCorner();
        ghostArray[ghostToIterate-1].rowIndex = emptycellforGhost[0];
		ghostArray[ghostToIterate-1].colIndex = emptycellforGhost[1];
		board[ghostArray[ghostToIterate-1].rowIndex][ghostArray[ghostToIterate-1].colIndex] = 8;
		ghostToIterate--;
	}
}

function putPacmanInBoard() {
	board[pacmanObject.rowIndex][pacmanObject.colIndex] = 0;
	var pacmanNewIndexes = findRandomEmptyCell();
	pacmanObject.rowIndex = pacmanNewIndexes[0];
	pacmanObject.colIndex = pacmanNewIndexes[1];
	board[pacmanObject.rowIndex][pacmanObject.colIndex] = pacmanObject.boardValue;
}

function StartAfterKilled() {
	putGhostsInBoard(false);
	putPacmanInBoard();
}

function generateNewGhosts() {
	var countGhosts = 0;
	while(countGhosts < numOfGhost)
	{
		ghostArray[countGhosts] = Object.create(ghost);
		countGhosts++;
	}
}

function Start() {

	if(localStorage.getItem("should_begin") == "true") {
		gameOver();
		// backgroundSound.play();
		var settingApples = food_remain;
		var settingPacman = pacman_remain;
		var settingPills = pill;
		var settingClock = clock;
		var settingWalls = moreWalls;
		pacmanObject = Object.create(pacman);
		for (var i = 0; i < board_row_size; i++) {
			board[i] = new Array();
			applesArray[i] = new Array();
			clockArray[i]=new Array();
			pillsArray[i] = new Array();
			//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
			for (var j = 0; j < board_col_size; j++) {
				if (
					(i == 3 && j == 3) ||
					(i == 3 && j == 4) ||
					(i == 3 && j == 5) ||
					(i == 6 && j == 1) ||
					(i == 6 && j == 2)
				) {
					board[i][j] = 4; ////Walls
					applesArray[i][j] = 0;
					clockArray[i][j] = 0;
					pillsArray[i][j] = 0;
				} else {
					var randomNum = Math.random();
					if (randomNum <= (1.0 * settingApples) / cnt) {
						settingApples--;
						var randomNum2 = Math.random();
						if (randomNum2<=0.6){
							board[i][j] = 1; //Food
							applesArray[i][j] = 1;
						}
						else if(randomNum2>0.6 && randomNum2 <= 0.9){
							board[i][j] = 13; //Food
							applesArray[i][j] = 13;
						}
						else{
							board[i][j] = 14; //Food
							applesArray[i][j] = 14;
						}
						//applesArray[i][j] = 1;
						pillsArray[i][j] = 0;
						clockArray[i][j]=0;
					} else if ((randomNum < (1.0 * (settingPacman + settingApples)) / cnt) && i !== 0 && j !== 0) {
						// shape.i = i;
						// shape.j = j;
						settingPacman--;
						pacmanObject.rowIndex = i;
						pacmanObject.colIndex = j;
						board[i][j] = pacmanObject.boardValue; //Pacman
						applesArray[i][j] = 0;
						pillsArray[i][j] = 0;
						clockArray[i][j]=0;
					} else {
						board[i][j] = 0; //Empty cells
						applesArray[i][j] = 0;
						pillsArray[i][j] = 0;
						clockArray[i][j]=0;
					}
					cnt--;
				}
			}
		}
		generateNewGhosts();
		putGhostsInBoard(true);
		if(numOfGhost<4){
			var emptyCellForDaveCorner = findNextEmptyCorner();
			board[emptyCellForDaveCorner[0]][emptyCellForDaveCorner[1]] = 11;
			daveObject = Object.create(dave);
			daveObject.rowIndex = emptyCellForDaveCorner[0];
			daveObject.colIndex = emptyCellForDaveCorner[1];
		}
		//Putting dave in an EmptyCell in the board
		else
		{
			var emptyCellForDave = findRandomEmptyCell(board);
			board[emptyCellForDave[0]][emptyCellForDave[1]] = 11;
			daveObject = Object.create(dave);
			daveObject.rowIndex = emptyCellForDave[0];
			daveObject.colIndex = emptyCellForDave[1];
		}
		while (settingApples > 0) {
			var emptyCell = findRandomEmptyCell(board);
			randomNum2 = Math.random();
			if (randomNum2<=0.6){
				board[emptyCell[0]][emptyCell[1]] = 1;
				applesArray[emptyCell[0]][emptyCell[1]] = 1;

			}
			else if(randomNum2>0.6 && randomNum2 <= 0.9){
				board[emptyCell[0]][emptyCell[1]] = 13;
				applesArray[emptyCell[0]][emptyCell[1]] = 13;

			}
			else{
				board[emptyCell[0]][emptyCell[1]] = 14;
				applesArray[emptyCell[0]][emptyCell[1]] = 14;
			}
			settingApples--;
		}
		while (settingPills>0){
			var emptycellforpill = findRandomEmptyCell(board);
			board[emptycellforpill[0]][emptycellforpill[1]] = 7;
			pillsArray[emptycellforpill[0]][emptycellforpill[1]] = 1;
			settingPills--;
		}
		while (settingClock>0){
			var emptycellforClock = findRandomEmptyCell(board);
			board[emptycellforClock[0]][emptycellforClock[1]] = 10;
			clockArray[emptycellforClock[0]][emptycellforClock[1]] = 1;
			settingClock--;
		}
		while (settingWalls>0){
			var emptycellformoreWalls = findRandomEmptyCell(board);
			board[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 4;
			applesArray[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 0;
			pillsArray[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 0;
			clockArray[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 0;
			settingWalls--;
		}

		keysDown = {};
		addEventListener(
			"keydown",
			function(e) {
				keysDown[e.keyCode] = true;
				if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
					e.preventDefault();
				}
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
		interval = setInterval(UpdatePosition, 150);
	}
}

function findRandomEmptyCell() {
	var i = Math.floor(Math.random() * (board_row_size-1) + 1);
	var j = Math.floor(Math.random() * (board_row_size-1) + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * (board_row_size-1) + 1);
		j = Math.floor(Math.random() * (board_row_size-1) + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keyUp]) {
		lastKeyPressed="UP";
		return 1;
	}
	if (keysDown[keyDown]) {
		lastKeyPressed="DOWN";
		return 2;
	}
	if (keysDown[keyLeft]) {
		lastKeyPressed="LEFT";
		return 3;
	}
	if (keysDown[keyRight]) {
		lastKeyPressed="RIGHT";
		return 4;
	}
}

function moveDaveRandomly() {
	var movementDir = chooseRandomMovement(daveObject);
	if(movementDir === "up")
	{
		//Draw Dave looking up?
		daveToDraw = daveImageUp;

	}
	else if(movementDir === "down")
	{
		//Draw Dave looking down?
		daveToDraw = daveImageDown;
	}
	else if(movementDir === "left")
	{
		//Draw Dave looking left?
		daveToDraw = daveImageLeft;
	}
	else if(movementDir === "right")
	{
		//Draw Dave looking right?
		daveToDraw = daveImage;
	}
	else if(movementDir === "stay"){

	}

}

function Draw() {
	// backgroundSound.play();
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblLives.value = Lives;
	userN.value = currentUser;
	for (var i = 0; i < board_row_size; i++) {
		for (var j = 0; j < board_col_size; j++) {
			var center = new Object();
			center.x = i * draw_size_x + draw_size_x / 2;
			center.y = j * draw_size_y + draw_size_y / 2;
			if (board[i][j] === 2) { //Draw pacman
				if (lastKeyPressed === "UP") { //WHERE TO PUT THE EYE OF PACMAN
					context.drawImage(pacmangirlup,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
				} else if (lastKeyPressed === "LEFT") {
					context.drawImage(pacmangirl,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
				} else if (lastKeyPressed === "DOWN") {
					context.drawImage(pacmangirldown,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
				} else if(lastKeyPressed ==="RIGHT"){
					context.drawImage(pacmangirlright,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
				}
				else if(lastKeyPressed ==="NOKEY"){
					context.drawImage(pacmangirl,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
				}

			} else if (board[i][j] === 1 || board[i][j] === 14 || board[i][j] === 13) { //Draw food
				context.beginPath();
				context.arc(center.x, center.y, draw_size_x/4, 0, 2 * Math.PI); // circle
				//context.fillStyle = "black"; //color
				if(board[i][j] === 1 ){
					context.fillStyle = cLightBalls;
				}
				else if(board[i][j] === 14){
					context.fillStyle = cHeavyBalls;
				}
				else {
					context.fillStyle = cMedBalls;
				}
				context.fill();
			} else if (board[i][j] === 4) {
				context.drawImage(wallImage,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
			}
			else if(board[i][j] === 7){
				context.drawImage(pillImage,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
			}
			else if(board[i][j] === 8){
				context.drawImage(ghostImage,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
			}
			else if (board[i][j] === 11)
			{
				if(shouldDrawDave)
				{
					context.drawImage(daveToDraw,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
				}
			}
			else if(board[i][j] === 10){
				context.drawImage(clockImage,center.x - draw_size_x/2,center.y - draw_size_y/2,draw_size_x,draw_size_y);
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
	else if(applesArray[rowIndex][colIndex] === 13)
	{
		board[rowIndex][colIndex] = 13;
	}
	else if(applesArray[rowIndex][colIndex] === 14)
	{
		board[rowIndex][colIndex] = 14;
	}
	else if(pillsArray[rowIndex][colIndex] === 1)
	{
		board[rowIndex][colIndex] = 7;
	}
	else if(clockArray[rowIndex][colIndex] === 1)
	{
		board[rowIndex][colIndex] = 10;
	}
	else
	{
		board[rowIndex][colIndex] = 0;
	}
}

function moveUp(character) {
	if(board[character.rowIndex][character.colIndex - 1] === 4 || character.rowIndex < 0 || character.rowIndex > board_row_size-1
	|| character.colIndex < 0 || character.colIndex > board_col_size-1)
	{
		return "fail";
	}
	if(board[character.rowIndex][character.colIndex - 1] === 2)
	{
		character.hitThePacman();
		return "stay";
	}
	else {
		board[character.rowIndex][character.colIndex - 1] = character.boardValue;
		checkApplesOrPills(character.rowIndex, character.colIndex);
		character.lastRow = character.colIndex;
		character.colIndex -= 1;
		return "up";
	}
}

function moveDown(character) {
	if(board[character.rowIndex][character.colIndex + 1] === 4 || character.rowIndex < 0 || character.rowIndex > board_row_size-1
		|| character.colIndex < 0 || character.colIndex > board_col_size-1)
	{
		return "fail";
	}
	if(board[character.rowIndex][character.colIndex + 1] === 2)
	{
		character.hitThePacman();
		return "stay";
	}
	else {
		board[character.rowIndex][character.colIndex + 1] = character.boardValue;
		checkApplesOrPills(character.rowIndex, character.colIndex);
		character.lastRow = character.colIndex;
		character.colIndex += 1;
		return "down";
	}
}

function moveLeft(character) {
	if(board[character.rowIndex - 1][character.colIndex] === 4 || character.rowIndex < 0 || character.rowIndex > board_row_size-1
		|| character.colIndex < 0 || character.colIndex > board_col_size-1)
	{
		return "fail";
	}
	if(board[character.rowIndex - 1][character.colIndex] === 2)
	{
		character.hitThePacman();
		return "stay";
	}
	else {
		board[character.rowIndex - 1][character.colIndex] = character.boardValue;
		checkApplesOrPills(character.rowIndex, character.colIndex);
		character.lastCol = character.rowIndex;
		character.rowIndex -= 1;
		return "left";
	}
}

function moveRight(character) {
	if(board[character.rowIndex + 1][character.colIndex ] === 4 || character.rowIndex < 0 || character.rowIndex > board_row_size-1
		|| character.colIndex < 0 || character.colIndex > board_col_size-1)
	{
		return "fail";
	}
	if(board[character.rowIndex + 1][character.colIndex ] === 2)
	{
		character.hitThePacman();
		return "stay";
	}
	else {
		board[character.rowIndex + 1][character.colIndex ] = character.boardValue;
		checkApplesOrPills(character.rowIndex, character.colIndex);
		character.lastCol = character.rowIndex;
		character.rowIndex += 1;
		return "right";
	}
}



function chooseRandomMovement(characterToMakeMove) {
	var isLegal = false;
	var rowIndex = characterToMakeMove.rowIndex;
	var colIndex = characterToMakeMove.colIndex;
	var nextRow;
	var nextCol;
	var randomGhostMove = 0;
	var countTries = 5;
	var resultMove = "fail";
	while (!isLegal && resultMove === "fail") {
		randomGhostMove = Math.random();
		if(countTries === 0)
		{
			characterToMakeMove.lastRow = 0;
			characterToMakeMove.lastCol = 0;
			countTries = 5;

		}

		if (randomGhostMove < 0.25) {
			nextCol = colIndex-1;
			if (colIndex > 0 && board[rowIndex][colIndex - 1] !== 4 && characterToMakeMove.lastCol !== nextCol) {//Up
				resultMove = moveUp(characterToMakeMove);
			}
		} else if ( randomGhostMove >= 0.25 && randomGhostMove < 0.5) {//Down
			nextCol = colIndex+1;
			if (colIndex < board_col_size-1 && board[rowIndex][colIndex + 1] !== 4 && characterToMakeMove.lastCol !== nextCol) {
				resultMove = moveDown(characterToMakeMove);
			}
		} else if ( randomGhostMove >= 0.5 && randomGhostMove < 0.75 ) {//Left
			nextRow = rowIndex - 1;
			if (rowIndex > 0 && board[rowIndex - 1][colIndex] !== 4 && characterToMakeMove.lastRow !== nextRow) {
				resultMove = moveLeft(characterToMakeMove);
			}
		} else if (randomGhostMove >= 0.75 && randomGhostMove < 1) {//Right
			nextRow = rowIndex + 1;
			if (rowIndex < board_row_size-1 && board[rowIndex + 1][colIndex] !== 4 && characterToMakeMove.lastRow !== nextRow) {
				resultMove = moveRight(characterToMakeMove);
                
			}
		}
		countTries--;
	}
	characterToMakeMove.lastRow = rowIndex;
	characterToMakeMove.lastCol = colIndex;
}

function makeSmartMoveForGhost(specificGhost) {
	var rowDiffValue = specificGhost.rowIndex - pacmanObject.rowIndex;
	var colDiffValue = specificGhost.colIndex - pacmanObject.colIndex;
	var movementResult = "";
	var pacmanMaxDistance = 0;
	if(colDiffValue > pacmanMaxDistance)
	{
		movementResult = moveUp(specificGhost);
	}
	else if(colDiffValue < -pacmanMaxDistance)
	{
		movementResult = moveDown(specificGhost);
	}
	else if(rowDiffValue > pacmanMaxDistance)
	{
		movementResult = moveLeft(specificGhost);
	}
	else if(rowDiffValue < -pacmanMaxDistance)
	{
		movementResult = moveRight(specificGhost);
	}
	else
	{
		chooseRandomMovement(specificGhost);
	}

	if(movementResult === "fail")
	{
		chooseRandomMovement(specificGhost);
	}

}

function moveGhostsRandomly() {
	var countGhosts = 0;
	while (countGhosts < numOfGhost)
	{
		//Make the ghost move toward the pacman every 3 moves
		// and otherwise choose random movement

		// chooseRandomMovement(ghostArray[countGhosts]);
		makeSmartMoveForGhost(ghostArray[countGhosts]);
		countGhosts++;
	}
}

function UpdatePosition() {
	if(localStorage.getItem("should_begin") == "true") {
		var ghostMoveTime = new Date();
		var ghost_time_elapsed = (ghostMoveTime - lastGhostMovementTime) / 1000;
		if(ghost_time_elapsed > 0.8)
		{
			moveGhostsRandomly();
			if(shouldDrawDave) {
				moveDaveRandomly();
			}
			lastGhostMovementTime = new Date();
		}


		board[pacmanObject.rowIndex][pacmanObject.colIndex] = 0;
		var x = GetKeyPressed();
		if (x == 1) {
			if (pacmanObject.colIndex > 0 && board[pacmanObject.rowIndex][pacmanObject.colIndex-1] !== 4) {
				if(board[pacmanObject.rowIndex][pacmanObject.colIndex-1] === 7){
					Lives = Lives+1;
					pillSound.play();
					board[pacmanObject.rowIndex][pacmanObject.colIndex-1] = 0;
					pillsArray[pacmanObject.rowIndex][pacmanObject.colIndex-1] = 0;
				}
				if(board[pacmanObject.rowIndex][pacmanObject.colIndex-1] === 10){
					board[pacmanObject.rowIndex][pacmanObject.colIndex-1] = 0;
					clockArray[pacmanObject.rowIndex][pacmanObject.colIndex-1] = 0;
					console.log(maximumTime);
					maximumTime +=10;
					console.log(maximumTime);

				}
				lastKeyPressed="UP";
				pacmanObject.colIndex--;
			}
		}
		if (x == 2) {
			if (pacmanObject.colIndex < board_col_size-1 && board[pacmanObject.rowIndex][pacmanObject.colIndex+1] !== 4) {
				if(board[pacmanObject.rowIndex][pacmanObject.colIndex+1] === 7){
					Lives = Lives+1;
					pillSound.play();
					board[pacmanObject.rowIndex][pacmanObject.colIndex+1] = 0;
					pillsArray[pacmanObject.rowIndex][pacmanObject.colIndex+1] = 0;
				}
				if(board[pacmanObject.rowIndex][pacmanObject.colIndex+1] === 10){
					clockArray[pacmanObject.rowIndex][pacmanObject.colIndex+1] = 0;
					board[pacmanObject.rowIndex][pacmanObject.colIndex+1] = 0;
					console.log(maximumTime);
					maximumTime +=10;
					console.log(maximumTime);

				}
				lastKeyPressed="DOWN";
				pacmanObject.colIndex++;

			}
		}
		if (x == 3) {
			if (pacmanObject.rowIndex > 0 && board[pacmanObject.rowIndex-1][pacmanObject.colIndex] !== 4) {
				if(board[pacmanObject.rowIndex-1][pacmanObject.colIndex] === 7){
					Lives = Lives+1;
					pillSound.play();
					board[pacmanObject.rowIndex-1][pacmanObject.colIndex] = 0;
					pillsArray[pacmanObject.rowIndex-1][pacmanObject.colIndex] = 0;
				}
				if(board[pacmanObject.rowIndex-1][pacmanObject.colIndex] === 10){
					board[pacmanObject.rowIndex-1][pacmanObject.colIndex] = 0;
					clockArray[pacmanObject.rowIndex-1][pacmanObject.colIndex] = 0;
					console.log(maximumTime);
					maximumTime +=10;
					console.log(maximumTime);
				}
				lastKeyPressed="LEFT";
				pacmanObject.rowIndex--;
			}
		}
		if (x == 4) {
			if (pacmanObject.rowIndex < board_row_size-1 && board[pacmanObject.rowIndex+1][pacmanObject.colIndex] !== 4) {
				if(board[pacmanObject.rowIndex+1][pacmanObject.colIndex] === 7){
					Lives = Lives+1;
					pillSound.play();
					board[pacmanObject.rowIndex+1][pacmanObject.colIndex] = 0;
					pillsArray[pacmanObject.rowIndex+1][pacmanObject.colIndex] = 0;
				}
				if(board[pacmanObject.rowIndex+1][pacmanObject.colIndex] === 10){
					board[pacmanObject.rowIndex+1][pacmanObject.colIndex] = 0;
					clockArray[pacmanObject.rowIndex+1][pacmanObject.colIndex] = 0;
					console.log(maximumTime);
					maximumTime +=10;
					console.log(maximumTime);

				}
				lastKeyPressed="RIGHT";
				pacmanObject.rowIndex++;
			}
		}
		if (board[pacmanObject.rowIndex][pacmanObject.colIndex] === 1) { // This is the score of 5 points balls!!!!!
			score=score+pointsLightBalls;
			eatSound.play();
			applesArray[pacmanObject.rowIndex][pacmanObject.colIndex] = 0;
		}
		if (board[pacmanObject.rowIndex][pacmanObject.colIndex] === 13) { // This is the score of 5 points balls!!!!!
			score=score+pointsMedBalls;
			eatSound.play();
			applesArray[pacmanObject.rowIndex][pacmanObject.colIndex] = 0;
		}
		if (board[pacmanObject.rowIndex][pacmanObject.colIndex] === 14) { // This is the score of 5 points balls!!!!!
			score=score+pointsHeavyBalls;
			eatSound.play();
			applesArray[pacmanObject.rowIndex][pacmanObject.colIndex] = 0;
		}
		if (board[pacmanObject.rowIndex][pacmanObject.colIndex] === 8) { // This is the score of 5 points balls!!!!!
			ghostArray[0].hitThePacman();
		}
		if (board[pacmanObject.rowIndex][pacmanObject.colIndex] === daveObject.boardValue) { // Eat Dave!!!!!
			daveObject.hitThePacman();
		}

		board[pacmanObject.rowIndex][pacmanObject.colIndex] = 2; // The location of the pacman
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
			if(score >= 100){
				gameOver();
				window.alert("Winner!!! You've earned "+score+" points!");

			}
			else{
				gameOver();
				window.alert("You are better than " + score + " points!");

			}
			return;
		}
		if(Lives === 0)
		{
			gameOver();
			window.alert("Loser! You've earned "+score+" points!" );

			return;
		}
		if (score >= 10*maxFood) {
			gameOver();
			window.alert("Winner!! You've earned "+score+" points!");

		}
		else {
			if (score >= 10*maxFood) {
				gameOver();
				window.alert("Winner!! You've earned "+score+" points!");

			} else {
				Draw();
			}
		}



	}
}

function gameOver() {
	try{
		backgroundSound.pause();
	}
	catch (e) {
		console.error(e);
	}
	try{
		backgroundSound.currentTime = 0;
	}
	catch (e) {
		console.error(e);
	}
	window.clearInterval(interval);
}
