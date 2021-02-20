import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//Each piece (square) of the board is a button that fills onClick
function Square(props) {
  return (
    <button className="square"
            onClick={props.onClick}>
      {props.value}
    </button>
  );
}

//The Board is composed of 9 Square pieces
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}/>
    );
  }

  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      xScore: 0,
      oScore: 0,
    };
  }

  handleClick(i) {
    //create new history if went back to prev moves, disregarding the old history
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //ignore click if there is a winner or if the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //if xIsNext is true, mark to X, else O
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    //store history of moves
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      //stepNumber is updated, old 'future' moves disregarded
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  updateScore(winner) {
    if (winner == 'X') {
      this.setState({xScore: this.state.xScore + 1});
    }
    else {
      this.setState({oScore: this.state.oScore + 1});
    }
  }

  // jumpTo(step) {
  //   this.setState({
  //     //update stepNumber to the move clicked on
  //     stepNumber: step,
  //     //x-player is next if step is even. eg move #1: 'X', xIsNext: False; move #2: 'O', xIsNext: True.
  //     xIsNext: (step % 2) === 0,
  //   })
  // }

  undoMove(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !this.state.xIsNext,
    })
  }

  resetBoard() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    })
  }

  newGame(winner) {
    this.updateScore(winner);
    this.resetBoard();
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //   const desc = move ?
    //     'Go to move #' + move :
    //     'Go to game start';
    //   return (
    //     <li key={move}>
    //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //     </li>
    //   );
    // });

    let undoBtn;
    let currentMove = this.state.stepNumber;
    if (currentMove > 0) {
      undoBtn = <button onClick={() => this.undoMove(currentMove-1)}>Undo</button>;
    }

    let status;
    let newOrReset;
    if (winner) {
      status = <span className="winStatus">Winner: {winner}</span>;
      newOrReset = <button onClick={() => this.newGame(winner)}>New Game</button>;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      newOrReset = <button onClick={() => this.resetBoard()}>Reset Game</button>;
    }

    return (
      //fill the board with the most recent array state
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <div className="gameOptions">
            <div>{newOrReset}</div>
            <div>{undoBtn}</div>
          </div>
        </div>
        <div className="game-info">
          <div className="scoreboard">
            <div>Player X:
              <div>{this.state.xScore}</div>
            </div>
            <div>Player O:
              <div>{this.state.oScore}</div>
            </div>
          </div>
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  //for each line (possible wins), check if the values of all 'X' or all 'O'.
  //return 'X' or 'O' (the winner) else nothing
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
