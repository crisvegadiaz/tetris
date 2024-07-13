### Inicio del Código
```javascript
window.addEventListener("load", () => {
```
1. **`window.addEventListener("load", () => {`**: Este evento se activa cuando la página se ha cargado completamente. La función definida dentro se ejecutará después de que todos los recursos, incluidos los scripts, imágenes y subframes, se hayan cargado.

### Obtener y Configurar el Lienzo
```javascript
  const canvas = document.getElementById("tetrixCanvas");
  const context = canvas.getContext("2d");
```
2. **`const canvas = document.getElementById("tetrixCanvas");`**: Obtiene el elemento `<canvas>` del DOM con el ID `tetrixCanvas`.
3. **`const context = canvas.getContext("2d");`**: Obtiene el contexto de renderizado 2D del lienzo para poder dibujar en él.

### Configuraciones Iniciales
```javascript
  const CUBE_SIZE = 20;
  const PADDING = 0;

  const COLS = canvas.width / CUBE_SIZE;
  const ROWS = canvas.height / CUBE_SIZE;
```
4. **`const CUBE_SIZE = 20;`**: Define el tamaño de cada "cubo" o "bloque" en el juego.
5. **`const PADDING = 0;`**: Define el espaciado entre los cubos, en este caso, sin espaciado.
6. **`const COLS = canvas.width / CUBE_SIZE;`**: Calcula el número de columnas en el lienzo.
7. **`const ROWS = canvas.height / CUBE_SIZE;`**: Calcula el número de filas en el lienzo.

### Definición de Colores y Figuras
```javascript
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
```
8. **`const COLORS = {...};`**: Define un objeto que contiene los colores (base, claro y oscuro) para cada tipo de figura.
9. **`const FIGURES = {...};`**: Define un objeto que contiene la representación matricial de cada figura.

### Configuración del Tablero y Variables del Juego
```javascript
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  let score = 0;
  let gameOver = false;
```
10. **`const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));`**: Crea el tablero de juego como una matriz 2D llena de `null` representando espacios vacíos.
11. **`let score = 0;`**: Inicializa la puntuación del jugador.
12. **`let gameOver = false;`**: Bandera que indica si el juego ha terminado.

### Función para Dibujar un Cubo
```javascript
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
```
13. **`function drawCube(x, y, size, colors) {...}`**: Función para dibujar un cubo en el lienzo. Dibuja el cubo con el color base y sombreados claros y oscuros para darle un efecto 3D.

### Función para Dibujar una Figura
```javascript
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
```
14. **`function drawFigure(x, y, figure, colors) {...}`**: Función para dibujar una figura en el lienzo. Recorre la matriz de la figura y dibuja cada cubo usando la función `drawCube`.

### Función para Obtener una Figura Aleatoria
```javascript
  function getRandomFigure() {
    const keys = Object.keys(FIGURES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { shape: FIGURES[key], colors: COLORS[key] };
  }
```
15. **`function getRandomFigure() {...}`**: Función que devuelve una figura aleatoria con su color correspondiente. Selecciona una clave aleatoria del objeto `FIGURES`.

### Función para Rotar una Figura
```javascript
  function rotate(figure) {
    return figure[0].map((_, colIndex) =>
      figure.map((row) => row[colIndex]).reverse()
    );
  }
```
16. **`function rotate(figure) {...}`**: Función que rota una figura 90 grados en el sentido de las agujas del reloj.

### Función para Verificar Colisiones
```javascript
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
```
17. **`function isColliding(newX, newY, newFigure) {...}`**: Función que verifica si una figura colisiona con los bordes del tablero o con otras figuras ya colocadas.

### Función para Congelar una Figura
```javascript
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
```
18. **`function freezeFigure() {...}`**: Función que añade la figura actual al tablero, "congelando" su posición.

### Función para Limpiar Filas Completas
```javascript
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
```
19. **`function clearFullRows() {...}`**: Función que limpia las filas completas del tablero, desplazando las filas superiores hacia abajo y actualizando la puntuación.

### Función para Dib

ujar el Tablero
```javascript
  function drawBoard() {
    board.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell) {
          drawCube(x * CUBE_SIZE, y * CUBE_SIZE, CUBE_SIZE, cell);
        }
      })
    );
  }
```
20. **`function drawBoard() {...}`**: Función que dibuja el tablero en el lienzo, dibujando cada cubo que no sea `null`.

### Variables y Función de Dibujado Inicial
```javascript
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
```
21. **`let currentFigure = getRandomFigure();`**: Inicializa la figura actual con una figura aleatoria.
22. **`let currentX = 4;`**: Posición horizontal inicial de la figura actual.
23. **`let currentY = 0;`**: Posición vertical inicial de la figura actual.
24. **`let lastTime = 0;`**: Almacena el último tiempo en que se actualizó la figura.
25. **`const speed = 500;`**: Define la velocidad de descenso de las figuras en milisegundos.
26. **`function draw() {...}`**: Función que dibuja la figura actual y el tablero en el lienzo.

### Funciones de Movimiento y Rotación
```javascript
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
```
27. **`function moveDown() {...}`**: Mueve la figura hacia abajo, la congela si colisiona y verifica si el juego ha terminado.
28. **`function moveLeft() {...}`**: Mueve la figura hacia la izquierda si no colisiona.
29. **`function moveRight() {...}`**: Mueve la figura hacia la derecha si no colisiona.
30. **`function rotateFigure() {...}`**: Rota la figura si no colisiona.

### Manejo de Eventos de Teclado
```javascript
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
```
31. **`document.addEventListener("keydown", (event) => {...}`**: Agrega un evento de teclado que maneja las teclas de flechas para mover o rotar la figura.

### Bucle del Juego
```javascript
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
```
32. **`function gameLoop(timestamp) {...}`**: Función que ejecuta el bucle del juego, moviendo la figura hacia abajo a intervalos regulares.
33. **`gameLoop(0);`**: Inicia el bucle del juego.

Este código es una implementación básica de Tetris usando JavaScript y HTML5 Canvas, manejando el renderizado de figuras, detección de colisiones, movimiento, rotación, y limpieza de filas completadas.