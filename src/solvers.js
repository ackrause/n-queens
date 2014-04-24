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
  var solutionCount = 0; // number of solutions
  var middleCount = 0;  // number of solutions derived from middle index
  var middle = Math.floor(n/2); // index of middle array
  var isOddN = n % 2 !== 0; // flag for whether we have to deal with special cases
  var middleSolution = false; // flag for determining if solution being checked is a middle case
  var allAvailable = []; // array of all true values
  var halfAvailable = []; // array with half true, half false

  // set up default availability arrays
  for (var i = 0; i < n; i++) {
    allAvailable[i] = true;
    halfAvailable[i] = isOddN ? i < Math.floor(n/2)+1 : i < n/2;
  }

  // helper function that builds and counts solutions based
  // on where queens have already been placed and what columns
  // are available for current row
  var genSolutionsCount = function(available, array) {
    array = array || []; // current placement of queens

    // if we have placed all n queens, count this as a solution
    if (array.length === n) {
      // if this solution is from the middle of an odd array
      // keep track of it seperately so it doesn't get doubled
      if (middleSolution) {
        middleCount++;
      } else {
        solutionCount++;
      }
      return;
    }

    // otherwise place the next queen
    for (var i = 0; i < available.length; i++) {
      // if this is a spot a queen can go
      if (available[i]) {

        // if we're looking at the middle column of the first row of an odd
        // n x n board, set a flag so we can keep track of these solutions separately
        if (isOddN && array.length === 0 && i === middle) {
          middleSolution = true;
        }

        // put the next queen here
        array.push(i);

        // create new availability array for the next row
        var newAvailable = allAvailable.slice();
        for (var a = 0; a < array.length; a++) {
          var left = array[a] - (array.length - a);
          var right = array[a] + (array.length - a);
          // cannot place in this column
          newAvailable[array[a]] = false;
          // cannot place diagonally to left
          if (left >= 0) { newAvailable[left] = false; }
          // cannot place diagonally to right
          if (right < n) { newAvailable[right] = false; }
        }

        // count the valid solutions generated after this move
        genSolutionsCount(newAvailable, array);

        // undo this move
        array.pop();

        // undo the middleSolution flag as we're done processing the middle index
        // of the first row
        if (middleSolution) {
          middleSolution = false;
        }
      }
    }
  };

  // check only the first half of the first row, exploiting symmetry
  genSolutionsCount(halfAvailable);

  // correct for symmetry exploitation
  solutionCount = 2 * solutionCount + middleCount;

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
