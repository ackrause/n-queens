/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

'use strict';

window.generateBoard = function(array) {
  var board = new Board({n : array.length});
  for (var i = 0; i < array.length; i++) {
    board.togglePiece(i, array[i]);
  }
  return board;
};

window.findNRooksSolutions = function(n) {
  var solutions = [];

  var available = _.range(n);
  var genPermutations = function(array) {
    array = array || [];
    if (array.length === n) {
      var testBoard = window.generateBoard(array);
      if (!testBoard.hasAnyRooksConflicts()) {
        solutions.push(testBoard);
      }
    }
    else {
      _.each(available, function(value, index) {
          array.push(value);
          available.splice(index, 1);
          genPermutations(array);
          array.pop();
          available.splice(index, 0, value);
      });
    }
  };
  genPermutations();
  return solutions;
};

window.findNRooksSolution = function(n, numSoln) {
  numSoln = numSoln || 0;
  var solutions = window.findNRooksSolutions(n);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solutions[numSoln].rows()));
  return solutions[numSoln].rows();
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutions = window.findNRooksSolutions(n);
  var solutionCount = solutions.length;

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


window.findNQueensSolutions = function(n) {
  var solutions = [];

  var available = _.range(n);
  var genPermutations = function(array) {
    array = array || [];
    if (array.length === n) {
      var testBoard = window.generateBoard(array);
      if (!testBoard.hasAnyQueensConflicts()) {
        solutions.push(testBoard);
      }
    }
    else {
      _.each(available, function(value, index) {
          array.push(value);
          available.splice(index, 1);
          genPermutations(array);
          array.pop();
          available.splice(index, 0, value);
      });
    }
  };
  genPermutations();
  return solutions;
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, numSoln) {
  numSoln = numSoln || 0;
  var solutions = window.findNQueensSolutions(n);

  //console.log('Single solution for ' + n + ' queens:', JSON.stringify(solutions[numSoln].rows()));
  return solutions.length > 0 ? solutions[numSoln].rows() : [];
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var allOnes = (1 << n) - 1;

  var recursiveCount = function(left, right, col, available) {
    // if we've placed a queen in every row, we found a solution
    if (col === allOnes) {
      solutionCount++;
    }

    if (available) {
      for (var i = 0; i < n; i++) {
        if (available & (1 << i)) {

          // new location
          var newLoc = 1 << i;

          // put value in new col
          var newCol = col | newLoc;

          // put value in left
          var newLeft = (left | newLoc) << 1;

          // put value in right
          var newRight = (right | newLoc) >> 1;

          // set up the new availability array
          var newAvailable = (newLeft | newRight | newCol) ^ allOnes;

          recursiveCount(newLeft, newRight, newCol, newAvailable);
        }
      }
    }
  };

  recursiveCount(0,0,0, allOnes);

  return solutionCount;
};
