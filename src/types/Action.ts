  export type Action = {
    value: number | number[];
    isNote?: boolean;
    operation?: 'redo' | 'undo';
    position: [number, number];
    removedNotes?: Action[];
  };