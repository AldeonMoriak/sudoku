  export type Action = {
    value: number | number[];
    isNote: boolean;
    command?: "add" | "remove";
    position: [number, number];
  };