import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
  	const rows = 3;
  	const cols = 3;
  	var count = 0; // starting count of squares

  	// initialize board
  	var board = [];

  	for (let i = 0; i < rows; i++) {
		var square = [];
		for (let i = 0; i < cols; i++) {
			square.push(this.renderSquare(count));
			count++;
		}
		// push row to board
		board.push(<div className="board-row">{square}</div>);
	}

	return (
	    <div>
			{board}
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
  		sortDown: true,
  	};
  }

  handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();

  	if (calculateWinner(squares) || squares[i]) {
		return;
	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	this.setState({
  		history: history.concat([{
	      squares: squares,
	    }]),
	    stepNumber: history.length,
  		xIsNext: !this.state.xIsNext,
  	});
  }

  jumpTo(step) {
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) === 0,
  	});
  }

  reorder(sortDown) {
  	/* Reorder the list of moves */
  	let reorder;
  	if (sortDown === true) {
  		reorder = false;
  	}
  	else {
  		reorder = true;
  	}
  	this.setState({
  		sortDown: reorder,
  	});
  }

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	const currentSort = this.state.sortDown;

  	const moves = history.map((step, move) => {
  		const desc = move ?
  			'Go to move #' + move + getMoveLocation(move, history):
  			'Go to game start';

  		var active = "";
  		if (this.state.stepNumber === move) {
  			active = "btn-active";
  		}

  		return (
  		    <li key={move}>
  		    	<button onClick={() => this.jumpTo(move)} class={active}>{desc}</button>
  		    </li>
  		);
  	});

  	let status;
  	if (winner) {
  		status = 'Winner: ' + winner;
  	} else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}

  	// display button for changing direction of sort
  	let sortBtn;
  	if (currentSort) {
  		sortBtn = <button onClick={() => this.reorder(currentSort)}>Sort descending</button>;
  	}
  	else {
  		sortBtn = <button onClick={() => this.reorder(currentSort)}>Sort ascending</button>;
  	  	moves.reverse();
  	}

    return (
      <div className="game">
        <div className="game-board">
          <Board
          	squares = {current.squares}
          	onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{sortBtn}</div>
          <ol reversed={!currentSort}>{moves}</ol>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getMoveLocation(move, history) {
	/* Compare current squares to previous to see where is the newest move */
	const current = history[move].squares;
	const previous = history[move-1].squares;

	for (var i = current.length - 1; i >= 0; i--) {
		if (current[i] !== previous[i]) {
			return getPositionCoordinates(i);
		}
	}
}

function getPositionCoordinates(position) {
	/* Get position of coordinates with given array value */
	var row = 0;
	var col = 0;

	if (position < 3) {
		row = 1;
		col = position + 1;
	}
	else if ((position >= 3) && (position <= 5)) {
		row = 2;
		col = position - 2;
	}
	else if ((position >= 6) && (position <= 8)) {
		row = 3;
		col = position - 5;
	}

	return "[" + col + ", " + row + "]";
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
