import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const INPUT_FILENAME = resolve(__dirname, "input");

const input = readFileSync(INPUT_FILENAME, { encoding: "utf-8" });

type LsCommand = {
  type: "ls";
  output: string[];
};

type CdCommand = {
  type: "cd";
  arg: string;
};

type Command = LsCommand | CdCommand;

const parseCommands = (input: string): Command[] => {
  return input
    .split("$")
    .filter((line) => !!line)
    .map((commandAsString): Command => {
      const [typeAndArg, ...output] = commandAsString.trim().split("\n");

      const [type, arg] = typeAndArg.split(" ");

      if (type === "ls") {
        return {
          type,
          output,
        };
      }

      if (type === "cd") {
        return {
          type,
          arg,
        };
      }

      throw new Error(`${type} is an invalid command`);
    });
};

type File = {
  type: "file";
  parent: Directory;
  name: string;
  size: number;
};

type Directory = {
  type: "directory";
  parent?: Directory;
  name: string;
  children: Node[];
};

type Node = Directory | File;

const constructFsTreeFromCommands = (commands: Command[]): Directory => {
  const tree: Directory = { type: "directory", name: "/", children: [] };

  let cwd = tree;

  commands.forEach((command) => {
    if (command.type === "ls") {
      const children: Node[] = command.output.map((item) => {
        if (item.match(/^dir\s\w+/)) {
          return {
            parent: cwd,
            type: "directory",
            name: item.split(" ")[1],
            children: [],
          };
        }

        const [size, name] = item.split(" ");

        return {
          parent: cwd,
          type: "file",
          name,
          size: Number(size),
        };
      });

      cwd.children.push(...children);
    }

    if (command.type === "cd") {
      if (command.arg === ".." && cwd.parent) {
        cwd = cwd.parent;
      } else if (command.arg === "/") {
        cwd = tree;
      } else {
        const childToCdInto = cwd.children.find(
          (child): child is Directory =>
            child.type === "directory" && child.name === command.arg
        );

        if (!childToCdInto) {
          throw new Error(`Can't find ${command.arg} in ${cwd.name}`);
        }

        cwd = childToCdInto;
      }
    }
  });

  return tree;
};

type DirsWithSizeMap = Map<Directory, number>;

const setSizesToMap = (node: Node, map: DirsWithSizeMap): number => {
  if (node.type === "file") {
    return node.size;
  }

  const size = node.children.reduce((acc, cur) => {
    return acc + setSizesToMap(cur, map);
  }, 0);

  map.set(node, size);

  return size;
};

const getDirsWithSizes = (fsTree: Node): DirsWithSizeMap => {
  const map: DirsWithSizeMap = new Map();

  setSizesToMap(fsTree, map);

  return map;
};

const getSum = (dirsWithSizes: DirsWithSizeMap) => {
  const AT_MOST = 100000;

  let sum = 0;

  dirsWithSizes.forEach((value) => {
    if (value < AT_MOST) sum += value;
  });

  return sum;
};

const getSizeOfDirToDelete = (
  dirsWithSizes: DirsWithSizeMap,
  minSpaceToDelete: number
) => {
  let minSize = Infinity;

  dirsWithSizes.forEach((value) => {
    if (value > minSpaceToDelete && value < minSize) {
      minSize = value;
    }
  });

  return minSize;
};

const a = () => {
  const commands = parseCommands(input);
  const fsTree = constructFsTreeFromCommands(commands);

  const dirsWithSizes = getDirsWithSizes(fsTree);

  const sum = getSum(dirsWithSizes);

  return sum;
};

const b = () => {
  const commands = parseCommands(input);
  const fsTree = constructFsTreeFromCommands(commands);

  const dirsWithSizes = getDirsWithSizes(fsTree);

  const TOTAL_SPACE = 70000000;
  const SPACE_FOR_UPDATE = 30000000;

  const rootSize = dirsWithSizes.get(fsTree);

  if (!rootSize) {
    throw new Error("Root size shouldn't be falsy");
  }

  const currentFreeSpace = TOTAL_SPACE - rootSize;

  const minSpaceToDelete = SPACE_FOR_UPDATE - currentFreeSpace;

  const sizeOfDirToDelete = getSizeOfDirToDelete(
    dirsWithSizes,
    minSpaceToDelete
  );

  return sizeOfDirToDelete;
};

console.log("a", a());
console.log("b", b());
