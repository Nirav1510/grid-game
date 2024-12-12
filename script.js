let N = 5;
let grid = [];
let robot1Position = [0, 0];
let robot2Position = [0, N - 1];
let totalScore = 0;
let currentRobot = 1;
let robot1Score = 0;
let robot2Score = 0;
let interval;
let visitedCells = new Set();

// elements
const gridElement = document.getElementById("grid");
const r1ScoreElement = document.getElementById("robot-1-score");
const r2ScoreElement = document.getElementById("robot-2-score");
const totalScoreElement = document.getElementById("total-score");

// inputs and controls
const gridSizeInput = document.getElementById("grid-size");
const generateGridBtn = document.getElementById("generate-grid-btn");
const resetBtn = document.getElementById("reset-btn");
const autoplayBtn = document.getElementById("autoplay-btn");

const resetGame = () => {
  clearInterval(interval);
  autoplayBtn.disabled = false;
  robot1Position = [0, 0];
  robot2Position = [0, N - 1];
  currentRobot = 1;
  robot1Score = 0;
  robot2Score = 0;
  visitedCells.clear();
  generateGrid();
  setInitialScores();
  renderGrid();
  updateScores();
};

const generateGrid = () => {
  grid = [];
  for (let i = 0; i < N; i++) {
    grid[i] = [];
    for (let j = 0; j < N; j++) {
      grid[i][j] = Math.floor(Math.random() * 10 + 1);
    }
  }
};

const setInitialScores = () => {
  const position1Key = `0,0`;
  const position2Key = `0,${N - 1}`;

  visitedCells.add(`robot1:${position1Key}`);
  visitedCells.add(`robot2:${position2Key}`);

  robot1Score = grid[0][0];
  robot2Score = grid[0][N - 1];
};

const renderGrid = () => {
  gridElement.innerHTML = "";
  gridElement.style.gridTemplateColumns = `repeat(${N}, 50px)`;
  gridElement.style.gridTemplateRows = `repeat(${N}, 50px)`;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = grid[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;

      const positionKey = `${i},${j}`;

      // Robot 1 path
      if (i === robot1Position[0] && j === robot1Position[1]) {
        cell.classList.add("robot1");
      }

      // Robot 2 path
      if (i === robot2Position[0] && j === robot2Position[1]) {
        cell.classList.add("robot2");
      }

      // path colors
      const visitedByRobot1 = visitedCells.has(`robot1:${positionKey}`);
      const visitedByRobot2 = visitedCells.has(`robot2:${positionKey}`);

      if (visitedByRobot1 && visitedByRobot2) {
        cell.classList.add("path-both");
      } else if (visitedByRobot1) {
        cell.classList.add("path-robot1");
      } else if (visitedByRobot2) {
        cell.classList.add("path-robot2");
      }

      cell.addEventListener("click", () => {
        handleCellClick(i, j);
      });

      gridElement.appendChild(cell);
    }
  }
};

const updateScores = () => {
  r1ScoreElement.textContent = robot1Score;
  r2ScoreElement.textContent = robot2Score;
  totalScoreElement.textContent = robot1Score + robot2Score;
};

const moveRobot = (robot, newX, newY) => {
  if (newX >= 0 && newX < N && newY >= 0 && newY < N) {
    const score = grid[newX][newY];
    const positionKey = `${newX},${newY}`;
    const robotKey =
      robot === 1 ? `robot1:${positionKey}` : `robot2:${positionKey}`;

    if (robot === 1) {
      robot1Position = [newX, newY];
      if (!visitedCells.has(positionKey)) {
        robot1Score += score;
      }

      visitedCells.add(robotKey);
    } else {
      robot2Position = [newX, newY];
      if (!visitedCells.has(positionKey)) {
        robot2Score += score;
      }

      visitedCells.add(robotKey);
    }

    renderGrid();
    updateScores();
  }
};

const handleCellClick = (row, col) => {
  const [robotX, robotY] = currentRobot === 1 ? robot1Position : robot2Position;

  if (
    (row === robotX + 1 && col === robotY) ||
    (row === robotX && col === robotY - 1) ||
    (row === robotX && col === robotY + 1)
  ) {
    moveRobot(currentRobot, row, col);
    currentRobot = currentRobot === 1 ? 2 : 1;
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    currentRobot = currentRobot === 1 ? 2 : 1;
    e.preventDefault();
  } else if (["ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    const direction =
      e.key === "ArrowDown" ? "down" : e.key === "ArrowLeft" ? "left" : "right";
    const [x, y] = currentRobot === 1 ? robot1Position : robot2Position;

    let newX = x + 1;
    let newY = y;
    if (direction === "left" && y > 0) newY--;
    if (direction === "right" && y < N - 1) newY++;

    moveRobot(currentRobot, newX, newY);
    currentRobot = currentRobot === 1 ? 2 : 1;
  }
});

generateGridBtn.addEventListener("click", () => {
  const newGridSize = parseInt(gridSizeInput.value);
  if (newGridSize >= 4 && newGridSize <= 100) {
    N = newGridSize;
    resetGame();
  } else {
    alert("Invalid grid size. Please enter a number between 4 and 100.");
  }
});

resetBtn.addEventListener("click", resetGame);

autoplayBtn.addEventListener("click", () => {
  clearInterval(interval);

  interval = setInterval(() => {
    const [x, y] = currentRobot === 1 ? robot1Position : robot2Position;

    let newX = x + 1;
    let leftY = y > 0 ? y - 1 : y;
    let rightY = y < N - 1 ? y + 1 : y;

    const downScore =
      x + 1 < N && !visitedCells.has(`${x + 1},${y}`)
        ? grid[x + 1][y]
        : -Infinity;
    const leftScore =
      x + 1 < N && y > 0 && !visitedCells.has(`${x + 1},${leftY}`)
        ? grid[x + 1][leftY]
        : -Infinity;
    const rightScore =
      x + 1 < N && y < N - 1 && !visitedCells.has(`${x + 1},${rightY}`)
        ? grid[x + 1][rightY]
        : -Infinity;

    let newY = y;
    let bestScore = downScore;

    if (leftScore > bestScore) {
      newY = leftY;
      bestScore = leftScore;
    }

    if (rightScore > bestScore) {
      newY = rightY;
      bestScore = rightScore;
    }

    moveRobot(currentRobot, newX, newY);
    visitedCells.add(`${newX},${newY}`);

    currentRobot = currentRobot === 1 ? 2 : 1;
  }, 1000);

  autoplayBtn.disabled = true;

  resetBtn.addEventListener("click", () => clearInterval(interval));
});

generateGrid();
setInitialScores();
renderGrid();
updateScores();
