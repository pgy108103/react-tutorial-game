import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function getCoords(index) {
  return {
    x: Math.floor(index / 3),
    y: index % 3,
  };
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
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  const color = props.isCurrent ? 'red' : undefined;
  return (
    <button className="square" style={{ color }} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const coords = getCoords(i);
    const { x, y } = this.props.coords;
    const isCurrent = coords.x === x && coords.y === y;

    return (
      <Square
        value={this.props.squares[i]}
        isCurrent={ isCurrent }
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
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          x: null,
          y: null,
        },
      ],
      xIsNext: true,
      step: 0,
    };
  }

  player() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  handleClick(i) {
    const { history: _history, xIsNext, step } = this.state;
    const history = _history.slice(0, step + 1);
    const squares = history.slice(-1)[0].squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.player();
    this.setState({
      history: history.concat({
        squares,
        ...getCoords(i),
      }),
      xIsNext: !xIsNext,
      step: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      step,
      xIsNext: !(step % 2),
    });
  }

  render() {
    const { history, step } = this.state;
    const { squares,x,y } = history[step];
    const winner = calculateWinner(squares);
    const status = winner ? `Winner: ${winner}` : `Next player: ${this.player()}`;
    const moves = history.map((step, move) => {
      const { x, y } = step;
      const desc = move ? `Go to move #${move} {${x},${y}}` : 'Go to game start';
      return (
        <li key={ move }>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            coords={{x,y}}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);