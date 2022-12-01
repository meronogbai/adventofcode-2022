import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const main = async () => {
  const input = await readFile(INPUT_FILENAME, { encoding: "utf-8" });
  const allCalories = input.split("\n");

  let highestCalories = 0;
  let tempCaloriesGroup: number[] = [];

  allCalories.forEach((calories, index) => {
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

  console.log(highestCalories);
};

main().catch((error) => {
  process.exit(1);
});
