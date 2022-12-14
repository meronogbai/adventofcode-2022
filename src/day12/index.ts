import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

const DIRECTIONS = [
  [-1, 0], // up
  [1, 0], // down
  [0, -1], // left
  [0, 1], // right
];

type Grid = string[][];
type Position = [number, number];

const parsePositions = (
  input: string
): { grid: Grid; startPosition: Position; endPosition: Position } => {
  let startPosition: Position | null = null;
  let endPosition: Position | null = null;

  const grid = input
    .trimEnd()
    .split("\n")
    .map((line, rowIndex) => {
      const row = line.split("");
      row.forEach((char, columnIndex) => {
        if (char === "S") {
          startPosition = [rowIndex, columnIndex];
        } else if (char === "E") {
          endPosition = [rowIndex, columnIndex];
        }
      });

      return row;
    });

  if (!startPosition || !endPosition) {
    throw new Error("startPosition or endPosition is not defined.");
  }

  return { grid, startPosition, endPosition };
};

const canMove = (from: string, to: string) => {
  if (from === "S") {
    from = "a";
  }

  if (to === "E") {
    to = "z";
  }

  if (from.toLowerCase() !== from || to.toLowerCase() !== to) {
    return false;
  }

  if (to.charCodeAt(0) - from.charCodeAt(0) <= 1) {
    return true;
  }

  return false;
};

const getNeighbors = (grid: Grid, position: Position) => {
  const possibleNeighbors: Position[] = DIRECTIONS.map(([dx, dy]) => [
    position[0] + dx,
    position[1] + dy,
  ]);

  return possibleNeighbors.filter((neighbor) => {
    const fromChar = grid[position[0]][position[1]];
    const toChar = grid[neighbor[0]]?.[neighbor[1]];
    if (toChar === undefined) return false;
    const isNeighbor = canMove(fromChar, toChar);

    return isNeighbor;
  });
};

const getSteps = (grid: Grid, start: Position, end: Position) => {
  const queue: [Position, number][] = [[start, 0]];
  const seen: boolean[][] = new Array(grid.length)
    .fill(undefined)
    .map(() => new Array(grid[0].length).fill(false));

  while (queue.length > 0) {
    const [currentPosition, steps] = queue.shift()!;

    if (currentPosition[0] === end[0] && currentPosition[1] === end[1]) {
      return steps;
    }

    const neighbors = getNeighbors(grid, currentPosition);

    for (const neighbor of neighbors) {
      if (seen[neighbor[0]][neighbor[1]]) {
        continue;
      }

      seen[neighbor[0]][neighbor[1]] = true;
      queue.push([neighbor, steps + 1]);
    }
  }

  return 0;
};

const a = () => {
  const { grid, startPosition, endPosition } = parsePositions(input);
  const steps = getSteps(grid, startPosition, endPosition);

  return steps;
};

const b = () => {
  const { grid, startPosition, endPosition } = parsePositions(input);
  const allStartPositions = grid.reduce(
    (acc, curr, rowIndex) => {
      if (!curr.includes("a")) return acc;

      const startPositions = curr
        .map((char, columnIndex): Position => [rowIndex, columnIndex])
        .filter((position) => {
          const isStartPosition = grid[position[0]][position[1]] === "a";
          return isStartPosition;
        });

      return [...acc, ...startPositions];
    },
    [startPosition]
  );

  const allPossibleSteps = allStartPositions
    .map((possibleStartPosition) =>
      getSteps(grid, possibleStartPosition, endPosition)
    )
    .filter((steps) => steps !== 0);

  return Math.min(...allPossibleSteps);
};

console.log("a", a());
console.log("b", b());
