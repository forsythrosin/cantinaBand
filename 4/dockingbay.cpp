#include <iostream>
#include <vector>

using namespace std;

const int size = 8;

void printSolution(vector<vector<bool> > board) {
  for (int i = 0; i < size; i++) {
    for (int j = 0; j < size; j++) {
      cout << (board[i][j] ? 'X' : '_') << '|';
    }
    cout << endl;
  }
  cout << endl << endl;
}


void place(int col, vector<bool> occupiedRow, vector<bool> occupiedDiag1, vector<bool> occupiedDiag2, vector<vector<bool> > board) {
  if (col >= size) {
    printSolution(board);
  }
  
  for (int row = 0; row < size; ++row) {
    int diag1Index = row + col;
    int diag2Index = size + row - col;
    if (!occupiedRow[row] && !occupiedDiag1[diag1Index] && !occupiedDiag2[diag2Index]) {
      vector<bool> newOccupiedRow{occupiedRow};
      vector<bool> newOccupiedDiag1{occupiedDiag1};
      vector<bool> newOccupiedDiag2{occupiedDiag2};
      vector<vector<bool> > newBoard{board};
      newOccupiedRow[row] = true;
      newOccupiedDiag1[diag1Index] = true;
      newOccupiedDiag2[diag2Index] = true;
      newBoard[row][col] = true;
      place(col + 1, newOccupiedRow, newOccupiedDiag1, newOccupiedDiag2, newBoard);
    }
  }
}

int main () {
  vector<bool> occupiedRow(size, false);
  vector<bool> occupiedDiag1(size*2, false);
  vector<bool> occupiedDiag2(size*2, false);
  
  vector<vector<bool> > board{size, vector<bool>(size, false)};
  
  place(0, occupiedRow, occupiedDiag1, occupiedDiag2, board);
  return 0;
}
