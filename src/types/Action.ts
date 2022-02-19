  export type Action = {
    value: number | number[];
    isNote?: boolean;
    position: [number, number];
    removedNotes?: Action[];
  };