import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

const getPriorityFromChar = (char: string) => {
  if (char.length > 1)
    throw new Error("Can only get priority of a single char");

  if (char.toUpperCase() === char) {
    return char.charCodeAt(0) + 27 - 65; // A starts at 65
  }

  return char.charCodeAt(0) - 96; // a starts at 97
};

const getItemInBothCompartments = (compt1: string, compt2: string) => {
  let duplicateItem: string | undefined;

  const setForCompt2 = new Set(compt2);

  for (const item of compt1) {
    if (setForCompt2.has(item)) {
      duplicateItem = item;
      break;
    }
  }

  if (!duplicateItem) {
    throw new Error("Invalid compartments.");
  }

  return duplicateItem;
};

const getItemInAllCompartments = (
  compt1: string,
  compt2: string,
  compt3: string
) => {
  let duplicateItem: string | undefined;

  const setForCompt2 = new Set(compt2);
  const setForCompt3 = new Set(compt3);

  for (const item of compt1) {
    if (setForCompt2.has(item) && setForCompt3.has(item)) {
      duplicateItem = item;
      break;
    }
  }

  if (!duplicateItem) {
    throw new Error("Invalid compartments.");
  }

  return duplicateItem;
};

const a = () => {
  return input
    .split("\n")
    .filter((line) => !!line)
    .map((line) => {
      if (line.length % 2 !== 0) {
        throw new Error(`${line}'s length is not even`);
      }

      const midpoint = line.length / 2;

      const firstCompartment = line.slice(0, midpoint);
      const secondCompartment = line.slice(midpoint, line.length);

      const duplicateItem = getItemInBothCompartments(
        firstCompartment,
        secondCompartment
      );

      return getPriorityFromChar(duplicateItem);
    })
    .reduce((acc, curr) => acc + curr);
};

function splitLinesByGroup(arr: string[]) {
  const groups = [];
  let i = 0;

  while (i < arr.length) {
    groups.push(arr.slice(i, (i += 3)));
  }

  return groups;
}

const b = () => {
  const lines = input.split("\n").filter((line) => !!line);
  const groups = splitLinesByGroup(lines);

  return groups
    .map((line) => {
      const duplicateItem = getItemInAllCompartments(line[0], line[1], line[2]);
      return getPriorityFromChar(duplicateItem);
    })
    .reduce((acc, curr) => acc + curr);
};

console.log("a", a());
console.log("b", b());
