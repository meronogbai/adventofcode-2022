import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type TreeGrid = number[][];

const parseGrid = (input: string): TreeGrid => {
  return input
    .trimEnd()
    .split("\n")
    .map((line) => line.split("").map((string) => Number(string)));
};

const isTreeVisible = ({
  treeGrid,
  rowIndex,
  columnIndex,
}: {
  treeGrid: TreeGrid;
  rowIndex: number;
  columnIndex: number;
}): boolean => {
  const isTreeInEdge =
    rowIndex === 0 ||
    rowIndex === treeGrid.length - 1 ||
    columnIndex === 0 ||
    columnIndex === treeGrid[rowIndex].length - 1;

  if (isTreeInEdge) {
    return true;
  }

  let isVisibleFromAbove = true;
  for (let i = rowIndex - 1; i >= 0; i--) {
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[i][columnIndex]) {
      isVisibleFromAbove = false;
      break;
    }
  }

  if (isVisibleFromAbove) {
    return true;
  }

  let isVisibleFromBelow = true;
  for (let i = rowIndex + 1; i < treeGrid.length; i++) {
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[i][columnIndex]) {
      isVisibleFromBelow = false;
      break;
    }
  }

  if (isVisibleFromBelow) {
    return true;
  }

  let isVisibleFromLeft = true;
  for (let i = columnIndex - 1; i >= 0; i--) {
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[rowIndex][i]) {
      isVisibleFromLeft = false;
      break;
    }
  }

  if (isVisibleFromLeft) {
    return true;
  }

  let isVisibleFromRight = true;

  for (let i = columnIndex + 1; i < treeGrid[rowIndex].length; i++) {
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[rowIndex][i]) {
      isVisibleFromRight = false;
      break;
    }
  }

  if (isVisibleFromRight) {
    return true;
  }

  return false;
};

const getVisibleTreesCount = (treeGrid: TreeGrid): number => {
  let visibleTreesCount = 0;

  treeGrid.forEach((row, rowIndex) => {
    row.forEach((_, columnIndex) => {
      const isVisible = isTreeVisible({
        treeGrid,
        rowIndex,
        columnIndex,
      });

      if (isVisible) {
        visibleTreesCount += 1;
      }
    });
  });

  return visibleTreesCount;
};

const getScenicScoreForTree = ({
  treeGrid,
  rowIndex,
  columnIndex,
}: {
  treeGrid: TreeGrid;
  rowIndex: number;
  columnIndex: number;
}) => {
  const isTreeInEdge =
    rowIndex === 0 ||
    rowIndex === treeGrid.length - 1 ||
    columnIndex === 0 ||
    columnIndex === treeGrid[rowIndex].length - 1;

  if (isTreeInEdge) {
    return 0;
  }

  let treesAbove = 0;
  for (let i = rowIndex - 1; i >= 0; i--) {
    treesAbove += 1;
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[i][columnIndex]) {
      break;
    }
  }

  let treesBelow = 0;
  for (let i = rowIndex + 1; i < treeGrid.length; i++) {
    treesBelow += 1;
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[i][columnIndex]) {
      break;
    }
  }

  let treesLeft = 0;
  for (let i = columnIndex - 1; i >= 0; i--) {
    treesLeft += 1;
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[rowIndex][i]) {
      break;
    }
  }

  let treesRight = 0;
  for (let i = columnIndex + 1; i < treeGrid[rowIndex].length; i++) {
    treesRight += 1;
    if (treeGrid[rowIndex][columnIndex] <= treeGrid[rowIndex][i]) {
      break;
    }
  }

  return treesAbove * treesBelow * treesLeft * treesRight;
};

const getScenicScoresForAllTrees = (treeGrid: TreeGrid): number[] => {
  const scenicScores: number[] = [];

  treeGrid.forEach((row, rowIndex) => {
    row.forEach((_, columnIndex) => {
      const scenicScoreForTree = getScenicScoreForTree({
        treeGrid,
        rowIndex,
        columnIndex,
      });

      scenicScores.push(scenicScoreForTree);
    });
  });

  return scenicScores;
};

const a = () => {
  const treeGrid = parseGrid(input);
  return getVisibleTreesCount(treeGrid);
};

const b = () => {
  const treeGrid = parseGrid(input);
  const scenicScores = getScenicScoresForAllTrees(treeGrid);

  return Math.max(...scenicScores);
};

console.log("a", a());
console.log("b", b());
