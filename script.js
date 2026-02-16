const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 12;
const ROWS = 20;
const BLOCK = 20;

const board = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(0)
);

const tetrominoes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1]
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1]
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1]
  ], // L
  [
    [0, 0, 1],
    [1, 1, 1]
  ] // J
];

let piece = randomPiece();

function randomPiece() {
  const shape =
    tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  return {
    shape,
    x: 4,
    y: 0
  };
}

function drawBlock(x, y) {
  ctx.fillStyle = "cyan";
  ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x * BLOCK, y * BLOCK, BLOCK, BLOCK);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) drawBlock(x, y);
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) drawBlock(piece.x + x, piece.y + y);
    });
  });
}

function collision() {
  return piece.shape.some((row, y) =>
    row.some((value, x) => {
      if (!value) return false;
      const newX = piece.x + x;
      const newY = piece.y + y;
      return (
        newX < 0 ||
        newX >= COLS ||
        newY >= ROWS ||
        board[newY]?.[newX]
      );
    })
  );
}

function merge() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[piece.y + y][piece.x + x] = 1;
      }
    });
  });
}

function drop() {
  piece.y++;
  if (collision()) {
    piece.y--;
    merge();
    piece = randomPiece();
  }
  drawBoard();
}

function move(dir) {
  piece.x += dir;
  if (collision()) piece.x -= dir;
  drawBoard();
}

function rotate() {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map(row => row[i]).reverse()
  );

  const oldShape = piece.shape;
  piece.shape = rotated;

  if (collision()) piece.shape = oldShape;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move(-1);
  if (e.key === "ArrowRight") move(1);
  if (e.key === "ArrowDown") drop();
  if (e.key === "ArrowUp") rotate();
});

setInterval(drop, 500);

drawBoard();
