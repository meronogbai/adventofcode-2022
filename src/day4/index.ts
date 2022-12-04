import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type Range = {
  lower: number;
  upper: number;
};

const parseRange = (rangeAsString: string): Range => {
  const [lowerAsString, upperAsString] = rangeAsString.split("-");

  const lower = Number(lowerAsString);
  const upper = Number(upperAsString);

  if (isNaN(lower) || isNaN(upper)) {
    throw new Error(`Cannot parse range from ${rangeAsString}`);
  }

  return {
    lower,
    upper,
  };
};

const isOneRangeFullyContained = (range1: Range, range2: Range) => {
  if (range1.lower <= range2.lower && range1.upper >= range2.upper) {
    return true;
  }

  if (range1.lower >= range2.lower && range1.upper <= range2.upper) {
    return true;
  }

  return false;
};

const doRangesOverlap = (range1: Range, range2: Range) => {
  if (range1.lower >= range2.lower && range1.lower <= range2.upper) {
    return true;
  }

  if (range2.lower >= range1.lower && range2.lower <= range1.upper) {
    return true;
  }

  return false;
};

const a = () => {
  return input
    .trimEnd()
    .split("\n")
    .reduce((acc, curr) => {
      const [firstRangeFromLine, secondRangeFromLine] = curr.split(",");

      const firstRange = parseRange(firstRangeFromLine);
      const secondRange = parseRange(secondRangeFromLine);

      const isOneRangeFullyContainedInAnother = isOneRangeFullyContained(
        firstRange,
        secondRange
      );

      if (isOneRangeFullyContainedInAnother) return acc + 1;

      return acc;
    }, 0);
};

const b = () => {
  return input
    .trimEnd()
    .split("\n")
    .reduce((acc, curr) => {
      const [firstRangeFromLine, secondRangeFromLine] = curr.split(",");

      const firstRange = parseRange(firstRangeFromLine);
      const secondRange = parseRange(secondRangeFromLine);

      const hasOverlap = doRangesOverlap(firstRange, secondRange);

      if (hasOverlap) return acc + 1;

      return acc;
    }, 0);
};

console.log("a", a());
console.log("b", b());
