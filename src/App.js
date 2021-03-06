import React from 'react';
import ReactDOM from 'react-dom/client';

function Square(props) {
  return(
     <button className="square" onClick={props.onClick}>
      {props.value}
     </button>
  );
}

class Board extends React.Component {  
  renderSquare(i) {
    //renderSquareメソッド内でpropsとしてvalueという名前の値をsquareに渡す
    //console.log('squares :' , this.props.squares[i])
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
  );
}

  render() {    
    return (
      <div>
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
  //stateの初期設定
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
        squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    // .slice()：配列のコピーを作成
    const squares = current.squares.slice();
    // console.log('handleClicle',squares)
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    // true -> X / faulse -> O
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      // concat()：元の配列をミューテートしない
      history: history.concat([
        {
          squares: squares,
          col_num: i % 3 + 1,
          row_num: parseInt(i / 3) + 1
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  // stateのhistoryプロパティの更新はない
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    //console.log('history',history)
    // console.log('stepNumber: ',this.state.stepNumber)
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      console.log({step})
      const desc = move ?
            'Go to move #' + move + '(col: ' + step.col_num + ', row:' + step.row_num + ')':
            'Go to game start';
      return (
        <li key={move}>
          {/*<button onClick={() => this.jumpTo(move)}>{desc}, {history.col_num}</button>*/}
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b> {desc} </b> : desc}
          </button>
        </li>
      );
    });
    
    let status;
    if (winner) { 
    status = 'Winner:' + winner;
    } else { 
      status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
    } 
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
           />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //console.log(squares)
    //console.log(a, b, c)
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
