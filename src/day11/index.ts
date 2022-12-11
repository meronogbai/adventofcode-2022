import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type Monkey = {
  startingItems: number[];
  operation: (old: number) => number;
  test: {
    divisibleBy: number;
    ifTrueThrowTo: number;
    ifFalseThrowTo: number;
  };
};

const parseMonkeys = (input: string): Monkey[] => {
  return input.split("\n\n").map((block) => {
    const [
      ,
      startingItemsLine,
      operationLine,
      divisibleByLine,
      trueLine,
      falseLine,
    ] = block.split("\n");

    const startingItems = startingItemsLine
      .split(":")[1]
      .trim()
      .split(", ")
      .map((item) => parseInt(item));

    const operation = (old: number): number => {
      const evalString = operationLine
        .split(":")[1]
        .trim()
        .split(" = ")[1]
        .replaceAll("old", old.toString());

      return eval(evalString);
    };

    const divisibleBy = parseInt(divisibleByLine.match(/\d+/)![0]);
    const ifTrueThrowTo = parseInt(trueLine.match(/\d+/)![0]);
    const ifFalseThrowTo = parseInt(falseLine.match(/\d+/)![0]);

    return {
      startingItems,
      operation,
      test: {
        divisibleBy,
        ifTrueThrowTo,
        ifFalseThrowTo,
      },
    };
  });
};

const getMonkeyBusinessLevel = ({
  monkeys,
  numOfRounds,
  getManagedWorryLevel,
}: {
  monkeys: Monkey[];
  numOfRounds: number;
  getManagedWorryLevel: (item: number) => number;
}): number => {
  const inspectedItemsCountMap = new Map<number, number>();

  for (let i = 0; i < numOfRounds; i++) {
    monkeys.forEach((monkey, monkeyIndex) => {
      while (monkey.startingItems.length > 0) {
        const item = monkey.startingItems.shift();

        if (item === undefined) {
          throw new Error(`Can't get item for monkey ${monkeyIndex}`);
        }

        const currentCount = inspectedItemsCountMap.get(monkeyIndex) || 0;
        inspectedItemsCountMap.set(monkeyIndex, currentCount + 1);

        const newItem = getManagedWorryLevel(monkey.operation(item));

        if (newItem % monkey.test.divisibleBy === 0) {
          monkeys[monkey.test.ifTrueThrowTo].startingItems.push(newItem);
        } else {
          monkeys[monkey.test.ifFalseThrowTo].startingItems.push(newItem);
        }
      }
    });
  }

  const sortedInspectedItemsCount = Array.from(
    inspectedItemsCountMap.values()
  ).sort((a, b) => b - a);

  return sortedInspectedItemsCount[0] * sortedInspectedItemsCount[1];
};

const a = () => {
  const monkeys = parseMonkeys(input);

  return getMonkeyBusinessLevel({
    monkeys,
    numOfRounds: 20,
    getManagedWorryLevel: (item) => Math.floor(item / 3),
  });
};

const b = () => {
  const monkeys = parseMonkeys(input);
  const divisor = monkeys
    .map((monkeys) => monkeys.test.divisibleBy)
    .reduce((acc, curr) => acc * curr, 1);

  return getMonkeyBusinessLevel({
    monkeys,
    numOfRounds: 10000,
    /** @note: this works because a % b = (a % c) % b */
    getManagedWorryLevel: (item) => item % divisor,
  });
};

console.log("a", a());
console.log("b", b());
