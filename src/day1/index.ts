import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

const a = () => {
  const allCalories = input.split("\n");

  let highestCalories = 0;
  let tempCaloriesGroup: number[] = [];

  allCalories.forEach((calories) => {
    if (calories !== "") {
      tempCaloriesGroup.push(Number(calories));
      return;
    }

    const sumOfCalories = tempCaloriesGroup.reduce((acc, curr) => acc + curr);

    if (sumOfCalories > highestCalories) {
      highestCalories = sumOfCalories;
    }

    tempCaloriesGroup = [];
  });

  return highestCalories;
};

const b = () => {
  const allCalories = input.split("\n");

  const caloriesCarriedByEachElf: number[] = [];

  let highestCalories = 0;
  let tempCaloriesGroup: number[] = [];

  allCalories.forEach((calories) => {
    if (calories !== "") {
      tempCaloriesGroup.push(Number(calories));
      return;
    }

    const sumOfCalories = tempCaloriesGroup.reduce((acc, curr) => acc + curr);

    caloriesCarriedByEachElf.push(sumOfCalories);

    if (sumOfCalories > highestCalories) {
      highestCalories = sumOfCalories;
    }

    tempCaloriesGroup = [];
  });

  const sortedCaloriesByEachElf = caloriesCarriedByEachElf.sort(
    (a, b) => b - a
  );

  const solution =
    sortedCaloriesByEachElf[0] +
    sortedCaloriesByEachElf[1] +
    sortedCaloriesByEachElf[2];

  return solution;
};

console.log("a", a());
console.log("b", b());
