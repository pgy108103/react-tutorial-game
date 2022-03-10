import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function getCoords(index) {
  return {
    x: Math.floor(index / 3),
    y: index % 3,
  };
}

function calculateWinLine(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

function calculateWinner(squares) {
  const line = calculateWinLine(squares);
  return line.length ? squares[line[0]] : null;
}

function Square(props) {
  const color = props.isCurrent ? 'red' : undefined;
  const backgroundColor = props.isWin ? 'yellow' : undefined;
  return (
    <button className="square" style={{ color, backgroundColor }} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const coords = getCoords(i);
    const { x, y } = this.props.coords;
    const isCurrent = coords.x === x && coords.y === y;
    const winLine = calculateWinLine(this.props.squares)
    const isWin = winLine.includes(i);

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isCurrent={isCurrent}
        isWin={isWin}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSquares() {
    const squares = [
      Array(3).fill(0),
      Array(3).fill(0),
      Array(3).fill(0),
    ].map((i, ii) => (
      <div className="board-row" key={ii}>
        {i.map((j, ji) => this.renderSquare(ii * 3 + ji))}
      </div>
    ));
    return squares;
  }

  render() {
    return (
      <div>
        {this.renderSquares()}
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
      isAsc: true,
    };
  }

  player() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  handleSortClick() {
    this.setState({
      isAsc: !this.state.isAsc,
    });
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
    const { history, step, isAsc } = this.state;
    const { squares, x, y } = history[step];
    const isFinal = squares.every(i => typeof i == 'string');
    const winner = calculateWinner(squares);
    const status = winner ? `Winner: ${winner}` : (isFinal ? 'Is Draw' : `Next player: ${this.player()}`);
    const moves = history.map((_step, move) => {
      const { x, y } = _step;
      const desc = move ? `Go to move #${move} [${x},${y}]` : 'Go to game start';
      const fontWeight = move === step ? 'bold' : undefined;
      return (
        <li key={move}>
          <button style={{ fontWeight }} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })
    moves.sort((a, b) => isAsc ? a.key - b.key : b.key - a.key);
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            coords={{ x, y }}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
            <button onClick={() => this.handleSortClick()}>{this.state.isAsc ? 'Asc' : 'Desc'}</button>
          </div>
          <ol>{moves}</ol>
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