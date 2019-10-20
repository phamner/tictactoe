var origBoard;  //will eventually be an array that tracks the board
const humanPlayer = 'O';
const compPlayer = 'X';
//all of the potential win combinations
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2]
];

const cells = document.querySelectorAll('.cell');

//calls the function startGame to start the game
startGame();

function startGame(){
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()); 				 //makes the array of board nums from 0 - 8
	//removes all of the x's and o's from the board at the start of the game
	for(var i = 0; i < cells.length; i++){
		cells[i].innerText = '';  							 // set the inner text to nothing
		cells[i].style.removeProperty('background-color');   //removes the colors of the winning squares
		cells[i].addEventListener('click', turnClick, false) //adds an event listener so that any time a square is clicked, it calls the function clickFunction
	}
}

function turnClick(square){
	console.log(square.target.id);  						//indicates in console the index of the square that the human player has clicked
	if(typeof origBoard[square.target.id] == 'number'){		//square must be unclicked for the player to select it to place their 'O'.  typeof == 'number' indicates that neither player has played in that spot.
		turn(square.target.id, humanPlayer)
		if(!checkTie()) turn(bestSpot(), compPlayer);
	}
}

function turn(squareId, player){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player; //adds 'O' to board
	let gameWon = checkWin(origBoard, player);  		  //check to see if the game has been won, and by which player
	if(gameWon) gameOver(gameWon)						  //whenever a turn is taken, check if the game has been won.  If yes, call the gameOver function, with the gameWon argument.
}

function checkWin(board, player){						  //recieves the board and the player.  The board is changing as the game goes on.
	let plays = board.reduce((a, e, i) =>				  //finds all the squares on board that have already been played with 'X' or 'O'.
		(e === player) ? a.concat(i) : a, []);			  
	let gameWon = null;									
	for (let [index, win] of winCombos.entries()){		  //checks to see if the game has been won, comparing current board to the win combos above.
		if(win.every(elem => plays.indexOf(elem) > -1)){  //check if all the places the player has played on every spot required to constitute a win combo.
			gameWon = {index: index, player: player};	  //now we know which win combo the player won on, and which player won.
			break;
		}
	}
	return gameWon;
}

function gameOver (gameWon){
	for(let index of winCombos[gameWon.index]){			 //colors each box that was part of the victory the color of the winning player
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++){				 //makes so players can't click squares that have already been played.
		cells[i].removeEventListener('click', turnClick, false)
	}
	declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose!") 
}

function declareWinner(who){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;

}

function emptySquares(){							    
	return origBoard.filter(s => typeof s =='number')  //filters each square to see if it is a number.  If a square has a number, then it is empty.
}

function bestSpot (){									//finds the spot for the AI player to play
	return emptySquares()[0]							//finds the first empty square.
}

function checkTie (){				
	if (emptySquares().length == 0){					//if length == 0, then all the squares are filled up, meaning there is a tie.
		for(var i = 0; i < cells.length; i++){
			cells[i].style.backgroundColor = "green";	//if tie, turn all squares green
			cells[i].removeEventListener('click', turnClick, false); //remove the event listener, so user can't click anywhere (the game is over)
		}
		declareWinner("Tie Game!")						
		return true;
	}
	return false;
}
