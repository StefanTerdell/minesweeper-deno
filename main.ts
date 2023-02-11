import { checkWin, createGrid, printGrid, reveal } from "./grid.ts";
import {
  cleanupTerm,
  clearBrackets,
  initTerm,
  printBrackets,
  readKeypress,
} from "./input.ts";

type GameState = "playing" | "won" | "lost" | "quit";

initTerm();

const size_x = 10;
const size_y = 10;
const grid = createGrid(10, 10, 0.1);

let state: GameState = "playing";
let pos_x = 0;
let pos_y = 0;

printGrid(grid);

while (state === "playing") {
  printBrackets(pos_x, pos_y);
  const key = readKeypress();
  clearBrackets(pos_x, pos_y);

  switch (key) {
    case "w": {
      if (pos_y > 0) {
        pos_y -= 1;
      }
      break;
    }
    case "a": {
      if (pos_x > 0) {
        pos_x -= 1;
      }
      break;
    }
    case "s": {
      if (pos_y < size_y - 1) {
        pos_y += 1;
      }
      break;
    }
    case "d": {
      if (pos_x < size_x - 1) {
        pos_x += 1;
      }
      break;
    }
    case " ": {
      if (reveal(grid, pos_x, pos_y)) {
        state = "lost";
      } else if (checkWin(grid)) {
        state = "won";
      }

      printGrid(grid);
      break;
    }
    case "f": {
      const cell = grid[pos_y][pos_x];

      if (cell.state === "visible") {
        break;
      }

      if (cell.state === "flagged") {
        cell.state = "invisible";
      } else {
        cell.state = "flagged";

        if (checkWin(grid)) {
          state = "won";
        }
      }

      printGrid(grid);

      break;
    }
    default: {
      state = "quit";
      break;
    }
  }
}

if (state !== "quit") {
  if (state == "lost") {
    console.log("You lost!");
  } else {
    console.log("You won!");
  }

  readKeypress();
}

cleanupTerm();
