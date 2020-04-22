var context;
var shape = new Object();
var board;
var score;
var Killed;
var pac_color;
var start_time;
var time_elapsed;
var backroundSound;
var eatSound;
var hitSound;
var interval;
var startAngle;
var lastKeyPressed;
$(document).ready(function() {
	context = canvas.getContext("2d");
    Start();
});

function Start() {
	lastKeyPressed ="NOKEY";
	board = new Array();
	score = 0;
	pac_color = "yellow";
	Killed = 5; // initial number of Killed
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	//Sounds
	backroundSound = document.getElementById( "backroundSound" );
	hitSound = document.getElementById( "hitSound" );
	eatSound = document.getElementById("eatSound");
	//usernametodisplay = document.getElementById('userName');

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
				board[i][j] = 4; ////Walls????
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1; //FOOD
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2; //PACMAN
				} else {
					board[i][j] = 0; //??????///WALLS????
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;  ///FOOD
		food_remain--;
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
	startAngle=getStartAngleForDraw();
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
				context.beginPath();
				//WHERE TO PUT THE PACMAN
				context.arc(center.x, center.y, 30, startAngle, 1.8 * Math.PI + startAngle);
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if (lastKeyPressed == "UP") { //WHERE TO PUT THE EYE OF PACMAN
					context.arc(center.x - 15, center.y + 5, 5, startAngle, 2 * Math.PI + startAngle); // circle
				} else if (lastKeyPressed == "LEFT") {
					context.arc(center.x - 5, center.y - 15, 5, startAngle, 2 * Math.PI + startAngle); // !
				} else if (lastKeyPressed == "DOWN") {
					context.arc(center.x - 15, center.y + 5, 5, startAngle, 2 * Math.PI + startAngle); // circle
				} else if(lastKeyPressed =="RIGHT"){
					context.arc(center.x + 5, center.y - 15, 5, startAngle, 2 * Math.PI + startAngle);
				}
				else if(lastKeyPressed =="NOKEY"){
					context.arc(center.x + 5, center.y - 15, 5, startAngle, 2 * Math.PI + startAngle);
				}
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) { //Draw food
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color --WALLS????
				context.fill();
			}
		}
	}
}


function getStartAngleForDraw() {
	if(lastKeyPressed=="UP"){
		startAngle= -0.5 * Math.PI;
		return startAngle;
	}
	else if(lastKeyPressed=="DOWN") {
		startAngle = 0.5 * Math.PI;
		return startAngle;
	}
	else if(lastKeyPressed=="LEFT") {
		startAngle = Math.PI;
		return startAngle;
	}
	else if(lastKeyPressed=="RIGHT") {
		startAngle = 0;
		return startAngle;
	}
	else{
		startAngle =0;
		return startAngle;
	}
}

function UpdatePosition() {
	if(localStorage.getItem("should_begin") == "true") {
		board[shape.i][shape.j] = 0;
		var x = GetKeyPressed();
		if (x == 1) {
			if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
				lastKeyPressed="UP";
				shape.j--;
			}
		}
		if (x == 2) {
			if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
				lastKeyPressed="DOWN";
				shape.j++;

			}
		}
		if (x == 3) {
			if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
				lastKeyPressed="LEFT";
				shape.i--;
			}
		}
		if (x == 4) {
			if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
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
		if (score >= 20 && time_elapsed <= 10) { //AFTER THIS THE PACMAN IS GREEN -NOTE TO AND!!!
			pac_color = "pink";
		}
		if (score == 50) { //NEED TO CHANGE ACOORDING THE ASS.2
			window.clearInterval(interval);
			window.alert("Game completed");
		} else {
			Draw();
		}
	}


	// The main game loop
	//NEED TO THINK ABOUT MAIN LOOP
	function main() {
		UpdatePosition();
		Draw();
	};
}
