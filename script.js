"use strict";
let tic_tac_toe = (function () {
    const POSITION_SHIFTS = {
        a1: 8,
        a2: 5,
        a3: 2,
        b1: 7,
        b2: 4,
        b3: 1,
        c1: 6,
        c2: 3,
        c3: 0,
    };
    const BIT_MASK = 0b1;
    const WIN_STATES = [
        0b111000000, 0b000111000, 0b000000111, 0b100100100, 0b010010010,
        0b001001001, 0b100010001, 0b001010100,
    ];
    const END_STATE = 0b111111111;
    // const INITIAL_STATE = 0b000000000;
    let userState = 0b000000000;
    let computerState = 0b000000000;
    let boardState = 0b000000000;
    let availableMoves = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];
    game();
    function game() {
        while (!gameOver()) {
            userState = placePiece(userState);
            updateBoardState();
            console.log(drawBoard());
            if (gameOver())
                return;
            computerState = placePiece(computerState, availableMoves[getComputerMove()]);
            updateBoardState();
            console.log(drawBoard());
            if (gameOver())
                return;
        }
    }
    function getComputerMove() {
        let min = Math.ceil(0);
        let max = Math.floor(availableMoves.length);
        return Math.floor(Math.random() * (max - min) + min);
    }
    function drawBoard() {
        let bitMask = 0b1;
        let position = ``;
        for (let i = 9; i > 0; i--) {
            bitMask = 0b1 << (i - 1);
            if (i === 3 || i === 6)
                position += "\n";
            if (userState & bitMask) {
                position += "x    ";
            }
            else if (computerState & bitMask) {
                position += "o    ";
            }
            else {
                position += "_    ";
            }
        }
        return position;
    }
    function gameOver() {
        for (let i = 0; i < WIN_STATES.length; i++) {
            if ((WIN_STATES[i] & userState) === WIN_STATES[i]) {
                console.log("Player wins!");
                return true;
            }
            else if ((WIN_STATES[i] & computerState) === WIN_STATES[i]) {
                console.log("Computer wins!");
                return true;
            }
        }
        return boardState === END_STATE;
    }
    // prettier-ignore
    function placePiece(state, computerMove = "") {
        var _a;
        updateBoardState();
        // get initial position and validate it
        let initialPosition = computerMove || ((_a = prompt("Please place piece on the board! (check console for state)")) === null || _a === void 0 ? void 0 : _a.toLowerCase());
        if (!validPositionCheck(initialPosition))
            return placePiece(state);
        // see if position is a valid move (is it in my keys?)
        let position = Object.keys(POSITION_SHIFTS).find(key => key === initialPosition);
        if (!validPositionCheck(position))
            return placePiece(state);
        // reassigning for consistency's sake
        let validPosition = position;
        // see if position is a legal move (is the move available? i.e. not occupied)
        // @ts-ignore
        let currentMove = BIT_MASK << POSITION_SHIFTS[validPosition];
        if (!legalPositionCheck(currentMove, validPosition))
            return placePiece(state);
        // update state if move is legal and valid
        return state | currentMove;
    }
    function validPositionCheck(position) {
        return !(position === null || position === undefined || position === "");
    }
    function legalPositionCheck(currentMove, position) {
        if (!(boardState & currentMove)) {
            console.log("it's empty!");
            // prettier-ignore
            availableMoves.splice(availableMoves.findIndex((ele) => ele === position), 1);
            return true;
        }
        return false;
    }
    function updateBoardState() {
        boardState = userState | computerState;
        console.log(boardState);
    }
    return {
    // placePiece,
    };
})();
/*
    I'm storing everything in a bitmap format.

    Let a player make a valid choice.
    Update their internal board state.
    Update joint board state
    Show current board
    Check to see if player won
      If they did win
        Make everything unclickable.
        Show winner message.
        Give option to reset the game
      Otherwise, return

    Let computer make a valid choice
    ...

*/
/*
      a       b      c
     __________________
    |     |      |     |
  1 |_____|______|_____|
    |     |      |     |
  2 |_____|______|_____|
    |     |      |     |
  3 |_____|______|_____|

*/
