let tic_tac_toe = (function () {
  const ticTacToeContainer = document.querySelector(".tic-tac-toe-container");
  const resetButton = document.querySelector("#restart") as HTMLButtonElement;
  const headerText = document.querySelector("#header-text") as HTMLElement;

  ticTacToeContainer?.addEventListener("click", processClick);
  resetButton?.addEventListener("click", resetGame);

  // prettier-ignore
  function resetGame() {
    userState = 0b000000000;
    computerState = 0b000000000;

    boardState = 0b000000000;

    availableMoves = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];

    let squares: Element[] = Array.from(ticTacToeContainer?.children!);
    squares.forEach((square) => drawPiece(square as HTMLElement, ""));
    ticTacToeContainer?.addEventListener("click", processClick);
    resetButton.disabled = true;
    resetButton.style.visibility = "hidden";
    headerText.textContent = "Tic-Tac-Toe";
  }

  function processClick(e: Event): void {
    let userChosenSquare = e.target as HTMLElement;
    handleUserMove(userChosenSquare);
  }

  function handleUserMove(userSquare: HTMLElement): void {
    if (!isMoveLegal(boardState, userSquare.className)) return;

    userState = applyMove(userState, userSquare.className);
    updateBoardState();
    drawPiece(userSquare, "X");
    updateAvailableMoves(userSquare.className);

    if (checkGameOver(userState)) return endGame("You won!");

    handleComputerMove();
  }

  function selectComputerMove(): string {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  function handleComputerMove(): void {
    let move = selectComputerMove();
    computerState = applyMove(computerState, move);
    updateBoardState();
    let computerSquare = document.querySelector(`.${move}`) as HTMLElement;
    drawPiece(computerSquare, "O");
    updateAvailableMoves(computerSquare.className);

    if (checkGameOver(computerState)) endGame("You lose...");
  }

  function checkGameOver(state: number): boolean {
    return WIN_STATES.some(
      (winState) => (state & winState) === winState || boardState === END_STATE,
    );
  }

  function endGame(message: string): void {
    ticTacToeContainer?.removeEventListener("click", processClick);
    headerText.textContent = message;
    resetButton.disabled = false;
    resetButton.style.visibility = "visible";
  }

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

  // prettier-ignore
  function drawPiece(outputSquare: HTMLElement, icon: string) {
    if(!outputSquare.firstChild) return
    outputSquare.firstChild.textContent = icon;
  }

  function updateAvailableMoves(position: string): void {
    const index = availableMoves.indexOf(position);
    if (index !== -1) availableMoves.splice(index, 1);
  }

  function isMoveLegal(state: number, position: string): boolean {
    // @ts-ignore
    const positionShift = POSITION_SHIFTS[position];
    const moveBit = BIT_MASK << positionShift;
    return (state & moveBit) === 0;
  }

  function applyMove(state: number, position: string): number {
    // @ts-ignore
    const positionShift = POSITION_SHIFTS[position];
    return state | (BIT_MASK << positionShift);
  }

  // prettier-ignore
  function updateBoardState() {
    boardState = userState | computerState;
  }

  return {
    // placePiece,
  };
})();
