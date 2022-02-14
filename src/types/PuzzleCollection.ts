import type { Puzzle } from "./Puzzle";
import type { PuzzleType } from "./PuzzleType";

export type PuzzleCollection = {
  [key in PuzzleType]?: Puzzle[];
};
