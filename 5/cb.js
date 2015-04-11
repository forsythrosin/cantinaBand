function runGames(numberOfGames) {
  var losses = [0,0];
  var print = numberOfGames < 6;
  for (var g = 0; g < numberOfGames; g++) {
    var loser = playGame(print);
    losses[loser-1]++;
  }
  console.log(losses);
}

function printBoard(board) {
  var loser = board[0][0];
  console.log('---------------');
  for (i = 0; i < 3; i++) {
    console.log(board[i]);
  }
  console.log('---------------');
  if (loser) console.log('Player', loser, 'lost!');
}

function playGame(print) {
  var board = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  
  var turn = Math.random() < 0.5;
  
  while (board[0][0] == 0) {
    turn = !turn;
    if (turn) player1(board);
    else player2(board);
  }
  loser = board[0][0];
  if (print) {
    printBoard(board);
  }
  return loser;
}

function place(board, pos, player) {
  //console.log('player', player, 'places', pos);
  for (var r = pos[0]; r < 3; r++) {
    for (var c = pos[1]; c < 5; c++) {
      if (board[r][c] == 0) board[r][c] = player;
    }
  }
}

function player1(board) {
  // Random
  var pos = [];
  do {
    pos = [
      Math.floor((Math.random() * 3)),
      Math.floor((Math.random() * 5))
    ];
  } while(board[pos[0]][pos[1]] != 0);
  place(board, pos, 1);
};


function player2(board) {
  // Almost random
  function blocked() {
    return board[0][1] && board[1][0];
  }
  var pos = [];
  do {
    pos = [
      Math.floor((Math.random() * 3)),
      Math.floor((Math.random() * 5))
    ];
  } while(board[pos[0]][pos[1]] != 0 || (pos[0] == 0 && pos[1] == 0 && !blocked()));
  place(board, pos, 2);
};

runGames(10000);