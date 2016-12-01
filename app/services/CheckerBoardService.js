angular.module('checkers').service('CheckerBoardService', function(){ 

	var board = new Array(8);
	//create a map of available jumps, map will contain an array of available jump locations
	var availableJumps = {};
	
	//used to let other components that a jump has taken place
	var jumpOccurred = false;

	var game;

	for(var i = 0; i < board.length; i++){
		board[i] = new Array(8);
		for(var j = 0; j < board[i].length; j++){
			board[i][j] = "";
		}
	}

	function populateBoard(positions){
		Object.keys(positions).forEach(function(key, value){
			var coord = key.split("");
			var x = coord[0].charCodeAt(0) - 97;
			var y = parseInt(coord[1]) - 1;
		
			board[x][y] = positions[key];		
		});
	};

	function setVirtualBoard(data) {
		board = data;
	}

	function getVirtualBoard(){
		return board;
	}

	function validMove(piece, oldPos, newPos){
		var bool = false;

		var oldCoord = oldPos.split("");
		var newCoord = newPos.split("");
		
		var oldX = oldCoord[0].charCodeAt(0) - 97;
		var oldY = parseInt(oldCoord[1]) - 1;

		var newX = newCoord[0].charCodeAt(0) - 97;
		var newY = parseInt(newCoord[1]) - 1;

		if(piece == 'wP'){
			if(positiveJump(piece, oldX, oldY, newX, newY)){
				bool = true;	
			}
			else if(positiveMove(oldX, oldY, newX, newY)){
				bool = true;
			}			
		} else if (piece == 'bP'){
			if(negativeMove(oldX, oldY, newX, newY)){
				bool = true;
			} else if(negativeJump(piece, oldX, oldY, newX, newY)){
				bool = true;
			}
		} else if(piece == 'wK' || piece == 'bK'){
			if(positiveJump(piece, oldX, oldY, newX, newY)){
				bool = true;	
			} else if(positiveMove(oldX, oldY, newX, newY)){
				bool = true;
			} else if(negativeMove(oldX, oldY, newX, newY)){
				bool = true;
			} else if(negativeJump(piece, oldX, oldY, newX, newY)){
				bool = true;
			}			
		}
		//update the board with the new location of the pieces
		if(bool){
			board[oldX][oldY] = "";
			board[newX][newY] = piece;
			kingMe(piece, newX, newY);
		}
		
		//update the board with the new coordinates
		return bool;
	}

/* Kings can move forward and backward
*/
	//forward move for whitepiece
	function positiveMove(oldX, oldY, newX, newY){
		var bool = true;
		if((newY - oldY) != 1 || ((newX - oldX) != 1 && (newX - oldX) != -1)){
			bool = false;
		}

		else if(board[newX][newY] != ""){
			bool = false;
		}
		return bool;
	}

	//forward move for blackpiece
	function negativeMove(oldX, oldY, newX, newY){
		var bool = true;
		if((newY - oldY) != -1 || ((newX - oldX) != 1 && (newX - oldX) != -1)){
				bool = false;
		}

		else if(board[newX][newY] != ""){
			bool = false;
		}
		return bool;
	}

	function positiveJump(piece, oldX, oldY, newX, newY){
		var bool = true;
		var pieceType = piece.split("");
		/*Check that the user moved the piece 2 rows up and 2 columns away 
		  from the orginal position
		*/
		if(newY - oldY != 2 || ((newX - oldX) != 2 && (newX-oldX) != -2)){
			bool = false;
		}
		//Check that the new location does not already have a piece there
		else if(board[newX][newY] != ""){
			bool = false;
		}

		//Check that there is a piece in between the jump so that the jump is valid
		//user jumped to the right
		else if(newX > oldX){
			/* istanbul ignore if */
			if(board[oldX+1][oldY+1] == "" || board[oldX+1][oldY+1].indexOf(pieceType[0]) != -1){
				bool = false;
			} else {
				//destroy the piece
				board[oldX+1][oldY+1] = "";
				jumpOccurred = true;
			}
			//the user jumped to the left
		} else if(newX < oldX){
			/* istanbul ignore if */
			if(board[oldX-1][oldY+1] == "" || board[oldX-1][oldY+1].indexOf(pieceType[0]) != -1){
				bool = false;
			} else {
				//destroy the piece
				board[oldX-1][oldY+1] = "";
				jumpOccurred = true;
			}

		}


		return bool;
	}

	function negativeJump(piece, oldX, oldY, newX, newY){
		var bool = true;
		var pieceType = piece.split("");
		/*Check that the user moved the piece 2 rows down and 2 columns away 
		  from the orginal position
		*/
		if(oldY - newY != 2 || ((newX - oldX) != 2 && (newX-oldX) != -2)){
			bool = false;
		}
		//Check that the new location does not already have a piece there
		else if(board[newX][newY] != ""){
			bool = false;
		}

		//Check that there is a piece in between the jump so that the jump is valid
		//user jumped to the right
		else if(newX > oldX){
			/* istanbul ignore if */
			if(board[oldX+1][oldY-1] == "" || board[oldX+1][oldY-1].indexOf(pieceType[0]) != -1){
				bool = false;
			} else {
				//destroy the piece
				board[oldX+1][oldY-1] = "";
				jumpOccurred = true;
			}
			//the user jumped to the left
		} else if(newX < oldX){
			/* istanbul ignore if */
			if(board[oldX-1][oldY-1] == "" || board[oldX-1][oldY-1].indexOf(pieceType[0]) != -1){
				bool = false;
			} else {
				//destroy the piece
				board[oldX-1][oldY-1] = "";
				jumpOccurred = true;
			}

		}
		return bool;
	}

	function kingMe(piece, newX, newY){
		if(piece == 'wP'){
			if(newY == 7){
				board[newX][newY] = 'wK';
			}
		} else if(piece == 'bP'){
			if(newY == 0){
				board[newX][newY] = 'bK';
			}
		}
	}

	//return true if there is a jump available and the selected piece is not a jumpable piece
	function checkForJumps(color, boardLocation){
		//used for getting first character of the color for comparison of piece objects
		var colorSplit = color.split("");
		//used for getting board locations to integer values
		var location = boardLocation.split("");
		//coords of the dragstart piece
		var x = location[0].charCodeAt(0) - 97;
		var y = parseInt(location[1]) - 1;
		var bool = false;
		var futureRowPositive;
		var futureRowNegative;
		var futureColPositive;
		var futureColNegative;

		//reset the value of flag for jumpoccurring
		jumpOccurred = false;

		for(var row = 0; row < board.length; row++){
			for(var col = 0; col < board[row].length; col++){
				//Get piece of the same color
				if(board[row][col].indexOf(colorSplit[0]) != -1){
					futureRowPositive = row+2;
					futureRowNegative = row-2;
					futureColPositive = col+2;
					futureColNegative = col-2;
					//FORWARD MOVE
					//Make sure rows do not go out array dimensions
					if(futureColPositive < board[row].length && board[row][col] != "bP"){
						//Make sure cols do not go out of array dimensions
						if(futureRowPositive < board[row].length){
							//check that there is ample jumping space, forward moves strictly enforce black mans to go forward
							if(board[futureRowPositive][futureColPositive] == ""){
								//check that there is a piece in the spot and that it is the opponents
								if(board[futureRowPositive-1][futureColPositive-1].indexOf(colorSplit[0]) == -1 && board[futureRowPositive-1][futureColPositive-1] != ""){
									//There is a jump available and the clicked piece is not the piece that can jump
									if(x == row && y == col){
										bool = false;
										addToAvailableJumps(futureRowPositive, futureColPositive, boardLocation);
										return bool;
									} else {
										
										bool = true;
									}
									
								} 
							} //Make sure cols and rows do not go out of array dimensions negatively 
						}
						if(futureRowNegative >= 0){
							//check to make sure there is ample jumping space
							if(board[futureRowNegative][futureColPositive] == ""){
								//check that there is a piece between of opposite color
								if(board[futureRowNegative+1][futureColPositive-1].indexOf(colorSplit[0]) == -1 && board[futureRowNegative+1][futureColPositive-1] != ""){
									//There is a jump available and the clicked piece is not the piece that can jump
									if(x == row && y == col){
										bool = false;
										addToAvailableJumps(futureRowNegative, futureColPositive, boardLocation);
										return bool;
									} else {
										bool = true;
									}
								}
							}
						}

					}
					//BACKWARD MOVE
					//Make sure rows do not go out array dimensions
					if(futureColNegative >= 0 && board[row][col] != "wP"){
						//Make sure cols do not go out of array dimensions
						if(futureRowNegative >= 0){
							//check that there is ample jumping space, backward moves strictly enforce white mans to go backward
							if(board[futureRowNegative][futureColNegative] == ""){
								//check that there is a piece in the spot and that it is the opponents
								if(board[futureRowNegative+1][futureColNegative+1].indexOf(colorSplit[0]) == -1 && board[futureRowNegative+1][futureColNegative+1] != ""){
									//There is a jump available and the clicked piece is not the piece that can jump
									if(x == row && y == col){
										bool = false;
										addToAvailableJumps(futureRowNegative, futureColNegative, boardLocation);
										return bool;
									} else {
										
										bool = true;
									}
									
								} 
							} //Make sure cols do not go out of array dimensions negatively 
						}
						if(futureRowPositive < board.length){
							//check to make sure there is ample jumping space
							if(board[futureRowPositive][futureColNegative] == ""){
								//check that there is a piece between of opposite color
								if(board[futureRowPositive-1][futureColNegative+1].indexOf(colorSplit[0]) == -1 && board[futureRowPositive-1][futureColNegative+1] != ""){
									//There is a jump available and the clicked piece is not the piece that can jump
									if(x == row && y == col){
										bool = false;
										addToAvailableJumps(futureRowPositive, futureColNegative, boardLocation);
										return bool;
									} else {
										
										bool = true;
									}
								}
							}
						}
					}
				}
			}
		}
		return bool;
	}

	function addToAvailableJumps(firstDigit, secondDigit, boardLocation){
		var chr = String.fromCharCode(97 + firstDigit);
        var boardPosition = chr.concat(secondDigit+1);
		if(boardLocation in availableJumps){
			availableJumps[boardLocation].push(boardPosition);
		} else {
			availableJumps[boardLocation] = [boardPosition];
		}
	}

	function forceJump(startPos, endPos){
		if(Object.keys(availableJumps).length === 0)
			return true;
		if(startPos in availableJumps){
			for(var i=0; i<availableJumps[startPos].length; i++){
				if(availableJumps[startPos][i] == endPos){
					//clear out the map for til the next time
					availableJumps = {};
					return true;
				}
			}
		}
		return false;
	}

	function checkDoubleJump(piece, position){
		checkForJumps(piece, position);
		if(Object.keys(availableJumps).length === 0){
			return false;
		}
		return true;
	}

	function getJumpOccurred(){
		return jumpOccurred;
	}

	function checkWinLose(playerColor) {
		var result = 'none';
		if (playerColor == 'wP' || playerColor == 'wK') {
			var containsBlack = boardContains(board, 'black');
			if (containsBlack == false) {
				result = 'win';
			}
		}
		else if (playerColor == 'bP' || playerColor == 'bK') {
			var containsWhite = boardContains(board, 'white');
			if (containsWhite == false) {
				result = 'win';
			}
		}

		return result;
	}

	function boardContains(board, value) {
		var piece;
		var king;
		if (value == 'black') {
			piece = 'bP';
			king = 'bK';
		}
		else if (value == 'white') {
			piece = 'wP';
			king = 'wK';
		}
		
		for (var i = 0; i < board.length; i++) {
			for (var k = 0; k < board[i].length; k++) {
				if (board[i][k] == piece || board[i][k] == king) {
					return true;
				}
			}
		}
	
		return false;
	}

	return{
		populateBoard:populateBoard,
		getVirtualBoard:getVirtualBoard,
		validMove:validMove,
		setVirtualBoard: setVirtualBoard,
		checkForJumps:checkForJumps,
		checkWinLose: checkWinLose,
		forceJump: forceJump,
		checkDoubleJump: checkDoubleJump,
		getJumpOccurred: getJumpOccurred
	}
});