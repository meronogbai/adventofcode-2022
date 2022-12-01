import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const main = async () => {
  const input = await readFile(INPUT_FILENAME, { encoding: "utf-8" });
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

  console.log(solution);
};

main().catch((error) => {
  process.exit(1);
});
