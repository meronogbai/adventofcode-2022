import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type Coordinates = [number, number];

type Direction = "U" | "D" | "R" | "L";

type Movement = {
  direction: Direction;
  steps: number;
};

const parseMovements = (input: string): Movement[] => {
  return input
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [direction, steps] = line.split(" ");

      return {
        direction: direction as Direction,
        steps: parseInt(steps),
      };
    });
};

const isTailTouchingHead = ({
  head,
  tail,
}: {
  head: Coordinates;
  tail: Coordinates;
}): boolean => {
  // overlapping
  if (head[0] === tail[0] && head[1] === tail[1]) {
    return true;
  }

  // same column
  if (head[0] === tail[0] && Math.abs(head[1] - tail[1]) === 1) {
    return true;
  }

  // same row
  if (head[1] === tail[1] && Math.abs(head[0] - tail[0]) === 1) {
    return true;
  }

  // diagonal
  if (Math.abs(head[0] - tail[0]) === 1 && Math.abs(head[1] - tail[1]) === 1) {
    return true;
  }

  return false;
};

const getNewPositionForTail = ({
  head,
  tail,
}: {
  head: Coordinates;
  tail: Coordinates;
}): Coordinates => {
  const newTail: Coordinates = [...tail];

  if (head[1] > tail[1]) {
    newTail[1] += 1;
  } else if (head[1] < tail[1]) {
    newTail[1] -= 1;
  }

  if (head[0] > tail[0]) {
    newTail[0] += 1;
  } else if (head[0] < tail[0]) {
    newTail[0] -= 1;
  }

  return newTail;
};

const getNewHeadForDirection = ({
  head,
  direction,
}: {
  head: Coordinates;
  direction: Direction;
}) => {
  const newHead: Coordinates = [...head];
  switch (direction) {
    case "U":
      newHead[0] += 1;
      break;
    case "D":
      newHead[0] -= 1;
      break;
    case "R":
      newHead[1] += 1;
      break;
    case "L":
      newHead[1] -= 1;
      break;
  }

  return newHead;
};

const getTailPath = (
  movements: Movement[],
  numOfKnots: number
): Coordinates[] => {
  const knotPaths = new Array(numOfKnots)
    .fill(undefined)
    .map((_): Coordinates[] => [[0, 0]]);

  movements.forEach((movement) => {
    for (let i = 0; i < movement.steps; i++) {
      const prevHead = knotPaths[0].at(-1)!;

      const newHead: Coordinates = getNewHeadForDirection({
        head: prevHead,
        direction: movement.direction,
      });

      knotPaths[0].push(newHead);

      for (let j = 1; j < knotPaths.length; j++) {
        const head = knotPaths[j - 1].at(-1)!;
        const tail = knotPaths[j].at(-1)!;

        if (!isTailTouchingHead({ head, tail })) {
          const newTail = getNewPositionForTail({ head, tail });

          knotPaths[j].push(newTail);
        }
      }
    }
  });

  return knotPaths[knotPaths.length - 1];
};

const getCountOfUniqueCoordinates = (coordinates: Coordinates[]) => {
  const set = new Set<string>();

  coordinates.forEach((coord) => {
    set.add(`${coord[0]}-${coord[1]}`);
  });

  return set.size;
};

const a = () => {
  const movements = parseMovements(input);

  const tailPath = getTailPath(movements, 2);
  const count = getCountOfUniqueCoordinates(tailPath);

  return count;
};

const b = () => {
  const movements = parseMovements(input);

  const tailPath = getTailPath(movements, 10);
  const count = getCountOfUniqueCoordinates(tailPath);

  return count;
};

console.log("a", a());
console.log("b", b());
