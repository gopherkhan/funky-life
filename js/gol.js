window.GameOfLife = (function GameOfLife() {
	var lifeGrid;
	var xsize = 16;
	var ysize = 16;
	var boardRender;

	var DEAD = 0;
	var ALIVE = 1;

	var BOARD_TYPE = {
		GLIDER: 'glider',
		BLINKER: 'blinker',
		FLOWER: 'flower'
	};

	function countNeighbors(x, y) {
		var n = 0, ax, ay;
		for (dx = -1; dx <= 1; ++dx) {
			if (dx < 0 && x === 0) {
				ax = xsize - 1;
			} else {
				ax = (x + dx) % xsize;	
			}

			for (dy = -1; dy <= ALIVE; ++dy) {
				// skip over self
				if (dx == 0 && dy == 0) { continue; }

				if (dy < 0 && y === 0) {
					ay = ysize - 1;
				} else {
					ay = (y + dy) % ysize;	
				}

	    		if (lifeGrid[ax][ay] === ALIVE) {
	    			++n;
	    		}
			}
		}
		return n;
	}

	function isValidCoord(x, y) {
		return (lifeGrid.length && x >= 0 && x < lifeGrid.length &&
		          lifeGrid[x] && y >= 0 && y < lifeGrid[x].length);
	}

	function kill(x,y) {
		if (lifeGrid[x][y] == ALIVE) {
			lifeGrid[x][y] = DEAD;
		}
	}

	function makeLive(x,y) {
		if (lifeGrid[x][y] == DEAD) {
			lifeGrid[x][y] = ALIVE;
		}
	}

	function nextStep() {
		var toLive = [];
		var toDie = [];

		// make a pass through to determine what to toggle
		for (var x = 0; x < xsize; ++x) {
			for (var y = 0; y < ysize; ++y) {
				n = countNeighbors(x, y);
				if (lifeGrid[x][y] === DEAD && n === 3) { 
					toLive.push([x,y]);
				} else if (lifeGrid[x][y] === ALIVE && n !== 2 && n !== 3) {
					toDie.push([x,y]);	
				}
			}
		}

		// then process our lists of things to toggle
		toLive.forEach(function(coord) {
			makeLive(coord[0], coord[1]);
		});

		toDie.forEach(function(coord) {
			kill(coord[0], coord[1]);
		});
	}
	
	var LIVE_TEMPLATE = "<div class='cell alive'></div>";
	var DEAD_TEMPLATE = "<div class='cell'></div>";

	function drawLifeGrid() {
		var text = "";
		for (var y = 0; y < ysize; ++y) {
			for (var x = 0; x < xsize; ++x) {
				text += (lifeGrid[x][y] == ALIVE ? LIVE_TEMPLATE : DEAD_TEMPLATE);
			}
			text += "<br/>";
		}

		boardRender.innerHTML = text;
	}

	function init(boardId) {
		boardRender = document.querySelector("#" + boardId);
		
	    // *** Change this variable to choose a different board setup from below
	    var lifeGridSetup = BOARD_TYPE.FLOWER;
	    
		lifeGrid = new Array(xsize);
		for (var x = 0; x < xsize; ++x) {
			lifeGrid[x] = new Array(ysize);
			for(var y = 0; y < ysize; ++y) {
				lifeGrid[x][y] = DEAD;
			}
		}
		
		if(lifeGridSetup == BOARD_TYPE.BLINKER) {
			// column then row
		    addBlinker();
	    } else if(lifeGridSetup == BOARD_TYPE.GLIDER) {
		    addGlider();
	    } else if(lifeGridSetup == BOARD_TYPE.FLOWER) {
	        addFlower();
	    }
	    
		drawLifeGrid();
	}


	function addBlinker() {
		lifeGrid[1][0] = ALIVE;
	    lifeGrid[1][1] = ALIVE;
	    lifeGrid[1][2] = ALIVE;
	}

	function addGlider() {
		lifeGrid[2][0] = ALIVE;
	    lifeGrid[2][1] = ALIVE;
	    lifeGrid[2][2] = ALIVE;
	    lifeGrid[1][2] = ALIVE;
	    lifeGrid[0][1] = ALIVE;
	}

	function addFlower() {
		lifeGrid[4][6] = ALIVE;
        lifeGrid[5][6] = ALIVE;
        lifeGrid[6][6] = ALIVE;
        lifeGrid[7][6] = ALIVE;
        lifeGrid[8][6] = ALIVE;
        lifeGrid[9][6] = ALIVE;
        lifeGrid[10][6] = ALIVE;
        lifeGrid[4][7] = ALIVE;
        lifeGrid[6][7] = ALIVE;
        lifeGrid[8][7] = ALIVE;
        lifeGrid[10][7] = ALIVE;
        lifeGrid[4][8] = ALIVE;
        lifeGrid[5][8] = ALIVE;
        lifeGrid[6][8] = ALIVE;
        lifeGrid[7][8] = ALIVE;
        lifeGrid[8][8] = ALIVE;
        lifeGrid[9][8] = ALIVE;
        lifeGrid[10][8] = ALIVE;
	}

	function renderNext() {
		nextStep();
		drawLifeGrid();
	}

	function animateForever() {
		renderNext();
		window.setTimeout(animateForever, 200);
	}


	function rotateArray(toRotate) {
		var tmp;

		var maxDepth = Math.floor(toRotate.length / 2);
		for (var depth = 0; depth < maxDepth; ++depth) {
			for (var i = depth; i < toRotate.length - (depth + 1); ++i) {
				// depth, i will serve as our pivot/temp node
				// swap with right side. As i increases along row, will increase down column
				swapNodes(toRotate, [depth, i], [i, toRotate.length - (depth + 1)]);
				// swap with bottom side. . As i increases along top row, will decrease along bottom row
				swapNodes(toRotate, [depth, i], [toRotate.length - (depth + 1), toRotate.length - (i + 1)]);
				// swap with left side. As i increases along row, will decrease up leftmost column
				swapNodes(toRotate, [depth, i], [toRotate.length - (i + 1), depth]);
			}
		}

		// [
		// 	[1, 2, 3],
		// 	[4, 5, 6],
		// 	[7, 8, 9]
		// ]

		return toRotate;
		// 	toRotate[i][i] toRotate [i][len - i]
		// [i][i], [len - 1][len - 1]
		// [i][i], [len - 1][i]
		// }

		// [0][0] swap [0][len - 1];    
		// [0][0] = [len - 1][len-1]
		// [0][0] = [len - 1][0]

		// swaps
		// [i][i], [i][len - i]
		// [i][i], [len - 1][len - 1]
		// [i][i], [len - 1][i]
	}

	function swapNodes(arr, coordA, coordB) {
		var tmp = arr[coordA[0]][coordA[1]];
		arr[coordA[0]][coordA[1]] = arr[coordB[0]][coordB[1]];
		arr[coordB[0]][coordB[1]] = tmp;
		//console.table(arr);
	}

	function rotateBoard() {
		rotateArray(lifeGrid);
	}

	return {
		init: init,
		renderNext: renderNext,
		animateForever: animateForever,
		addFlower: addFlower,
		addGlider: addGlider,
		addBlinker: addBlinker,
		rotateBoard: rotateBoard
	};
});