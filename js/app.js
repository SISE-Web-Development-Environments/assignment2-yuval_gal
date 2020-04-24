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
$(document).ready(function() {
	context = canvas.getContext("2d");
    Start();
});

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
}
function initializeParameters() {
	lastKeyPressed ="NOKEY"; // Note-start game no key pressed
	Killed = 5; // initial number of Killed
	pill=3;
	moreWalls=9;
	numOfGhost=4;
}

function Start() {
	initializeImages();
	initializeAudio();
	initializeParameters();
	board = new Array();
	score = 0;
	//pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	restart = document.getElementById("restartBtn");
	restart.addEventListener("click",gameRestart);
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
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
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1; //Food
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2; //Pacman
				} else {
					board[i][j] = 0; //Empty cells
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	while (pill>0){
		var emptycellforpill = findRandomEmptyCell(board);
		board[emptycellforpill[0]][emptycellforpill[1]] = 7;
		pill--;
	}
	while (moreWalls>0){
		var emptycellformoreWalls = findRandomEmptyCell(board);
		board[emptycellformoreWalls[0]][emptycellformoreWalls[1]] = 4;
		moreWalls--;
	}
	while (numOfGhost>0){
		var emptycellforGhost = findRandomEmptyCell(board);
		board[emptycellforGhost[0]][emptycellforGhost[1]] = 8;
		numOfGhost--;
	}
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
	backroundSound.play();
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

function UpdatePosition() {
	if(localStorage.getItem("should_begin") == "true") {
		board[shape.i][shape.j] = 0;
		var x = GetKeyPressed();
		if (x == 1) {
			if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
				if(board[shape.i][shape.j - 1] == 7){
					Killed = Killed+1;
					pillSound.play();
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
				}
				lastKeyPressed="RIGHT";
				shape.i++;
			}
		}
		if (board[shape.i][shape.j] == 1) { // This is the score of 5 points balls!!!!!
			score=score+5;
			eatSound.play();
		}
		board[shape.i][shape.j] = 2; // The location of the pacman
		var currentTime = new Date();
		time_elapsed = (currentTime - start_time) / 1000;
		if (score >= 20 && time_elapsed <= 10) { //AFTER THIS THE PACMAN IS PINK -NOTE TO AND!!!
			//pac_color = "pink";
		}
		if (score == 50) { //NEED TO CHANGE ACOORDING THE ASS.2
			window.clearInterval(interval);
			window.alert("Game completed");
		} else {
			Draw();
		}
	}
}
