import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

enum Moves {
  ROCK,
  PAPER,
  SCISSORS,
}

const defeatsMap = {
  [Moves.ROCK]: Moves.SCISSORS,
  [Moves.SCISSORS]: Moves.PAPER,
  [Moves.PAPER]: Moves.ROCK,
};

const losesMap = {
  [Moves.SCISSORS]: Moves.ROCK,
  [Moves.PAPER]: Moves.SCISSORS,
  [Moves.ROCK]: Moves.PAPER,
};

const opponentMoves: Record<string, Moves> = {
  A: Moves.ROCK,
  B: Moves.PAPER,
  C: Moves.SCISSORS,
};

const myMoves: Record<string, Moves> = {
  X: Moves.ROCK,
  Y: Moves.PAPER,
  Z: Moves.SCISSORS,
};

const scoreByMove = {
  [Moves.ROCK]: 1,
  [Moves.PAPER]: 2,
  [Moves.SCISSORS]: 3,
};

enum RoundOutcome {
  LOSE,
  DRAW,
  WIN,
}

const expectedOutcomes: Record<string, RoundOutcome> = {
  X: RoundOutcome.LOSE,
  Y: RoundOutcome.DRAW,
  Z: RoundOutcome.WIN,
};

const scoreByOutcome = {
  [RoundOutcome.LOSE]: 0,
  [RoundOutcome.DRAW]: 3,
  [RoundOutcome.WIN]: 6,
};

const getRoundOutcome = ({
  myMove,
  opponentMove,
}: {
  myMove: Moves;
  opponentMove: Moves;
}): RoundOutcome => {
  if (myMove === opponentMove) return RoundOutcome.DRAW;

  if (defeatsMap[myMove] === opponentMove) return RoundOutcome.WIN;

  return RoundOutcome.LOSE;
};

const getMoveForOutcome = ({
  opponentMove,
  outcome,
}: {
  opponentMove: Moves;
  outcome: RoundOutcome;
}) => {
  switch (outcome) {
    case RoundOutcome.DRAW:
      return opponentMove;
    case RoundOutcome.WIN:
      return losesMap[opponentMove];
    case RoundOutcome.LOSE:
      return defeatsMap[opponentMove];
  }
};

const a = () => {
  const solution = input
    .split("\n")
    .map((round) => {
      if (round === "") return 0;

      const [opponentMoveInput, myMoveInput] = round.split(" ");

      const opponentMove = opponentMoves[opponentMoveInput];
      const myMove = myMoves[myMoveInput];

      if (opponentMove === undefined || myMove === undefined) return 0;

      const roundOutCome = getRoundOutcome({ opponentMove, myMove });

      return scoreByMove[myMove] + scoreByOutcome[roundOutCome];
    })
    .reduce((acc, curr) => acc + curr);

  return solution;
};

const b = () => {
  const solution = input
    .split("\n")
    .map((round) => {
      if (round === "") return 0;

      const [opponentMoveInput, roundOutComeInput] = round.split(" ");

      const opponentMove = opponentMoves[opponentMoveInput];
      const outcome = expectedOutcomes[roundOutComeInput];

      if (opponentMove === undefined || outcome === undefined) return 0;

      const myMove = getMoveForOutcome({ opponentMove, outcome });

      return scoreByMove[myMove] + scoreByOutcome[outcome];
    })
    .reduce((acc, curr) => acc + curr);

  return solution;
};

console.log("a", a());
console.log("b", b());
