import './App.css'
import {useState} from "react";

function Square({value, onSquareClick}) {
    return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
    let tempNextSquares;

    function handleClick(index) {
        if (squares[index] !== null || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[index] = 'X';
        } else {
            nextSquares[index] = 'O';
        }
        tempNextSquares = nextSquares;
        onPlay(nextSquares)
    }

    const winner = calculateWinner(squares);
    let boardStatus;
    if (winner) {
        boardStatus = "Winner: " + winner + ", Game is over,please restart";
    } else {
        boardStatus = "Next player: " + (xIsNext ? "X" : "O");
    }

    function handleRestartButton() {
        if (winner) {
            let ok = prompt("是否重新进行对局?", "是");
            if (ok === "是") {
                window.location.reload()
            }
        } else {
            alert("游戏还未结束，暂不能重开，请完成对局!")
        }
    }


    return (
        <div className="board-parent">
            <div className="boardStatus">{boardStatus}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
            <div className="restartGame">
                <button onClick={handleRestartButton}>Restart Game</button>
            </div>


        </div>
    )
}


export default function Game() {
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove]

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
        setXIsNext(!xIsNext)
    }

    function JumpToStep(nextMove) {
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);

    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start"
        }
        return (
            <li key={move}>
                <button onClick={() => JumpToStep(move)}>{description}</button>
            </li>
        )
    })

    if (history.length === 10) {
        let ok = prompt("游戏结束未分出胜负，是否重新对局?", "是");
        if (ok === "是") {
            window.location.reload()
        }
    }


    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
            <div className="siteFoot">
                Powered by Fireinrain by Love ❤️
            </div>
        </div>
    )
}


function calculateWinner(squares) {
    const winnerSituationIndex = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winnerSituationIndex.length; i++) {
        const [a, b, c] = winnerSituationIndex[i]
        if (squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
    }
    return null;

}

function checkIfGameFinished(tempNextSquares) {
    for (let i = 0; i < tempNextSquares.length; i++) {
        if (tempNextSquares[i] === null) {
            return false;
        }
    }
    return true;
}