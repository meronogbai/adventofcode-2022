import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

const getMarkerIndex = ({
  dataStream,
  distinctChars,
}: {
  dataStream: string[];
  distinctChars: number;
}) => {
  return dataStream.findIndex((char, index) => {
    if (index < distinctChars - 1) return false;

    const setOfLast4Chars = new Set(
      dataStream.slice(index - (distinctChars - 1), index + 1)
    );

    if (setOfLast4Chars.size === distinctChars) return true;

    return false;
  });
};

const getPacketMarkerIndex = (dataStream: string[]) => {
  return getMarkerIndex({ dataStream, distinctChars: 4 });
};

const getMessageMarkerIndex = (dataStream: string[]) => {
  return getMarkerIndex({ dataStream, distinctChars: 14 });
};

const a = () => {
  const dataStream = input.trimEnd().split("");

  return getPacketMarkerIndex(dataStream) + 1;
};

const b = () => {
  const dataStream = input.trimEnd().split("");

  return getMessageMarkerIndex(dataStream) + 1;
};

console.log("a", a());
console.log("b", b());
