window.addEventListener("load", () => {
  const canvas = document.getElementById("tetrixCanvas");
  const context = canvas.getContext("2d");

  const CUBE_SIZE = 20;
  const PADDING = 0;

  const COLS = canvas.width / CUBE_SIZE;
  const ROWS = canvas.height / CUBE_SIZE;

  const COLORS = {
    Z: { color: "#E74C3C", light: "#F1948A", dark: "#C0392B" },
    S: { color: "#27AE60", light: "#2ECC71", dark: "#1E8449" },
    J: { color: "#3498DB", light: "#5DADE2", dark: "#2E86C1" },
    T: { color: "#9B59B6", light: "#AF7AC5", dark: "#884EA0" },
    O: { color: "#F1C40F", light: "#F7DC6F", dark: "#D4AC0D" },
    L: { color: "#E67E22", light: "#EB984E", dark: "#CA6F1E" },
    I: { color: "#1ABC9C", light: "#48C9B0", dark: "#17A589" },
  };

  const FIGURES = {
    Z: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    O: [
      [1, 1],
      [1, 1],
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    I: [[1, 1, 1, 1]],
  };

  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  let score = 0;
  let gameOver = false;
  
  function drawCube(x, y, size, colors) {
    context.fillStyle = colors.color;
    context.fillRect(x, y, size, size);

    context.fillStyle = colors.dark;
    context.beginPath();
    context.moveTo(x, y + size);
    context.lineTo(x + size, y + size);
    context.lineTo(x + size, y + size - 10);
    context.lineTo(x + 10, y + size - 10);
    context.closePath();
    context.fill();

    context.fillStyle = colors.light;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + size, y);
    context.lineTo(x + size - 10, y + 10);
    context.lineTo(x + 10, y + 10);
    context.closePath();
    context.fill();
  }

  function drawFigure(x, y, figure, colors) {
    figure.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          drawCube(
            x + colIndex * (CUBE_SIZE + PADDING),
            y + rowIndex * (CUBE_SIZE + PADDING),
            CUBE_SIZE,
            colors
          );
        }
      });
    });
  }

  function getRandomFigure() {
    const keys = Object.keys(FIGURES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { shape: FIGURES[key], colors: COLORS[key] };
  }

  function rotate(figure) {
    return figure[0].map((_, colIndex) =>
      figure.map((row) => row[colIndex]).reverse()
    );
  }

  function isColliding(newX, newY, newFigure) {
    return newFigure.some((row, rowIndex) =>
      row.some((cell, colIndex) => {
        if (cell) {
          const x = newX + colIndex;
          const y = newY + rowIndex;
          return (
            x < 0 ||
            x >= COLS ||
            y < 0 ||
            y >= ROWS ||
            (board[y] && board[y][x])
          );
        }
        return false;
      })
    );
  }

  function freezeFigure() {
    currentFigure.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          board[currentY + rowIndex][currentX + colIndex] =
            currentFigure.colors;
        }
      });
    });
  }

  function clearFullRows() {
    let rowsCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (board[y].every((cell) => cell !== null)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(null));
        y++;
        rowsCleared++;
      }
    }
    score += rowsCleared * 100;
    document.getElementById("score").textContent = `Puntaje: ${score}`;
  }

  function drawBoard() {
    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell) {
          drawCube(x * CUBE_SIZE, y * CUBE_SIZE, CUBE_SIZE, cell);
        }
      })
    );
  }

  let currentFigure = getRandomFigure();
  let currentX = 4;
  let currentY = 0;
  let lastTime = 0;
  const speed = 500; // Milisegundos entre cada movimiento hacia abajo

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFigure(
      currentX * CUBE_SIZE,
      currentY * CUBE_SIZE,
      currentFigure.shape,
      currentFigure.colors
    );
    drawBoard();
  }

  function moveDown() {
    if (!isColliding(currentX, currentY + 1, currentFigure.shape)) {
      currentY += 1;
    } else {
      freezeFigure();
      clearFullRows();
      currentFigure = getRandomFigure();
      currentX = 4;
      currentY = 0;
      if (isColliding(currentX, currentY, currentFigure.shape)) {
        alert("Game Over");
        gameOver = true;
        document.location.reload();
      }
    }
    draw();
  }

  function moveLeft() {
    if (!isColliding(currentX - 1, currentY, currentFigure.shape)) {
      currentX -= 1;
      draw();
    }
  }

  function moveRight() {
    if (!isColliding(currentX + 1, currentY, currentFigure.shape)) {
      currentX += 1;
      draw();
    }
  }

  function rotateFigure() {
    const rotatedFigure = rotate(currentFigure.shape);
    if (!isColliding(currentX, currentY, rotatedFigure)) {
      currentFigure.shape = rotatedFigure;
      draw();
    }
  }

  document.addEventListener("keydown", (event) => {
    if (gameOver) return;
    switch (event.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowDown":
        moveDown();
        break;
      case "ArrowUp":
        rotateFigure();
        break;
    }
  });

  function gameLoop(timestamp) {
    if (gameOver) return;
    if (timestamp - lastTime > speed) {
      moveDown();
      lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop(0);
});
