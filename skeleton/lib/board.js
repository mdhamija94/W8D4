let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];

  for (let i = 0; i < 8; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(null);
    }
    grid.push(row);
  }

  grid[3][4]= new Piece ("black");
  grid[4][3]= new Piece ("black");
  grid[4][4]= new Piece ("white");
  grid[3][3] = new Piece("white");
  
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  return this.grid[pos[0]][pos[1]];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0
};


/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.grid[pos[0]][pos[1]]) {
    return this.grid[pos[0]][pos[1]].color === color;
  } 
  return false;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.grid[pos[0]][pos[1]] !== null;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove("white") && !this.hasMove("black"))
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] > 7 || pos[0] < 0 || pos[1] > 7 || pos[1] < 0) {
    return false;
  }
  return true;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {

  if (!board.isValidPos(pos)) {
    piecesToFlip = [];
    return piecesToFlip;
  } else if (!board.isOccupied(pos)){
    piecesToFlip = [];
    return piecesToFlip;
  } else if (board.isOccupied(pos) && board.isMine(pos, color)) {
    return piecesToFlip;
  }

  
  if (!board.isMine(pos, color)) {
    piecesToFlip.push(board.grid[pos[0]][pos[1]])
  } 
  
  // if (_positionsToFlip(board, [pos[0] + dir[0], pos[1] + dir[1]], color, dir, piecesToFlip) === null) {
  //   return piecesToFlip;
  // }
  piecesToFlip = _positionsToFlip(board, [pos[0] + dir[0], pos[1] + dir[1]], color, dir, piecesToFlip);
  
  return piecesToFlip;
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw Error("Invalid Move");
    return;  
  }

  this.grid[pos[0]][pos[1]] = new Piece (color);

  for (let i = 0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i];
    let pieces = _positionsToFlip(this, [pos[0] + dir[0], pos[1] + dir[1]], color, dir, []);

    for (let j = 0; j < pieces.length; j++) {
      pieces[j].flip();
    }
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log("   0  1  2  3  4  5  6  7")
  for (let i = 0; i < 8; i++) {
    process.stdout.write(`${i}|`);
   
    for (let j = 0; j < 8; j++) {
      let piece = this.grid[i][j];
      if (piece) {
        process.stdout.write(` ${piece.toString()} `);
      } else {
        process.stdout.write("   ");
      }
    }

    console.log(`|`);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos) ) {
    return false;
  }

  for (let i = 0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i];
    let x = _positionsToFlip(this, [pos[0] + dir[0], pos[1] + dir[1]], color, dir, [])
    if (x && x.length > 0) {
      return true;
    }
  }

  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let moves = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color)) {
        moves.push([i, j]);
      }
    }
  }

  return moves;
};

module.exports = Board;

// let b = new Board()
// b.print()
// console.log("END")

// let a = []
// console.log(_positionsToFlip(b, [4 , 5-1], "white", [0, -1], []));
// console.log(_positionsToFlip (b, [4, 5-1], "black", [0, -1], []));
// console.log(_positionsToFlip(b, [4-1, 5 - 1], "white", [-1, -1], []));
// console.log(_positionsToFlip(b, [4-1, 5 - 1], "black", [-1, -1], []));
// console.log(b.validMoves("white") )
// console.log(b.validMoves("black") )
// b.vaidMove ([4,5], "white")
// console.log(a)
//  console.log(b.validMove([0, 8], "white"))

// b.placePiece([0,0], "white");
// b.print();