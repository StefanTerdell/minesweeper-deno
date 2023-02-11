import { write } from "./input.ts";

type CellContent = "mine" | "empty" | number;

type CellState = "invisible" | "visible" | "flagged";

type Cell = {
  content: CellContent;
  state: CellState;
};

type Grid = Array<Array<Cell>>;

export function createGrid(
  sizeX: number,
  sizeY: number,
  incidence: number
): Grid {
  const grid = Array.from(new Array(sizeY), () =>
    Array.from(
      new Array(sizeX),
      (): Cell => ({
        content: Math.random() < incidence ? "mine" : "empty",
        state: "invisible",
      })
    )
  );

  countMines(grid);

  return grid;
}

export function countMines(grid: Grid): void {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x].content === "mine") continue;

      let count = 0;

      for (
        let sy = Math.max(y - 1, 0);
        sy <= Math.min(y + 1, grid.length - 1);
        sy++
      ) {
        for (
          let sx = Math.max(x - 1, 0);
          sx <= Math.min(x + 1, grid[y].length - 1);
          sx++
        ) {
          if (grid[sy][sx].content === "mine") {
            count += 1;
          }
        }
      }

      if (count > 0) {
        grid[y][x].content = count;
      }
    }
  }
}

export function printGrid(grid: Grid): void {
  console.clear();

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];

      const char =
        cell.state === "invisible"
          ? "I"
          : cell.state === "flagged"
          ? "f"
          : cell.content === "mine"
          ? "*"
          : cell.content === "empty"
          ? " "
          : String(cell.content);

      write(` ${char}`);
    }

    console.log();
  }
}

export function checkWin(grid: Grid): boolean {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];

      if (cell.state === "invisible") return false;

      if ((cell.state === "flagged") !== (cell.content === "mine")) {
        return false;
      }
    }
  }

  return true;
}

// Returns true if you revealed a mine
export function reveal(grid: Grid, x: number, y: number): boolean {
  const cell = grid[y][x];

  if (cell.state !== "invisible") {
    return false;
  }

  cell.state = cell.state = "visible";

  if (cell.content === "mine") {
    return true;
  }

  if (cell.content === "empty") {
    for (
      let sy = Math.max(y - 1, 0);
      sy <= Math.min(y + 1, grid.length - 1);
      sy++
    ) {
      for (
        let sx = Math.max(x - 1, 0);
        sx <= Math.min(x + 1, grid[y].length - 1);
        sx++
      ) {
        reveal(grid, sx, sy);
      }
    }
  }

  return false;
}
