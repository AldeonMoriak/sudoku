<script lang="ts">
  import Header from "../components/Header.svelte";
  import type { Action } from "src/types/Action";
  import type { Cell } from "src/types/Cell";
  import type { Lang } from "src/types/Lang";
  import type { MoveType } from "src/types/MoveType";

  import { onDestroy } from "svelte";
  import type { Box } from "src/types/Box";
  import Board from "../components/Board.svelte";
  import InputNumbers from "../components/InputNumbers.svelte";

  let lang: Lang = "en";
  let selectedCell: [number, number] = [-1, -1];
  let selectedBox: Box = {
    rows: [],
    columns: [],
  };
  let isNoteEnabled = false;
  let isTimerShown = true;
  let isMenuShown = false;

  let actions: Action[] = [];
  let redoActions: Action[] = [];

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const farsiNumKeys = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  let leftTime = ["00", "00", "00"];
  const startDate = Date.now();

  const timerHandler = () => {
    const seconds = Date.now() - startDate;
    leftTime = toStringTime(seconds);
  };

  const timer = setInterval(timerHandler, 500);

  const toStringTime = (time: number) => {
    const seconds = time / 1000;
    return [
      Math.floor(seconds / 3600).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }),
      Math.floor((seconds % 3600) / 60).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }),
      (Math.floor(seconds % 3600) % 60).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }),
    ];
  };

  type Puzzle = {
    puzzleGrid: number[];
    clearGrid: number[];
  };
  type PuzzleCollection = {
    easy: Puzzle[];
    hard: Puzzle[];
  };

  const puzzles: PuzzleCollection = {
    easy: [
      {
        puzzleGrid: [
          9, 5, 1, 4, 3, 2, 8, 6, 7, 4, 7, 2, 6, 5, 8, 1, 9, 3, 6, 3, 8, 9, 1,
          7, 5, 2, 4, 8, 1, 7, 2, 9, 6, 4, 3, 5, 3, 9, 4, 5, 8, 1, 2, 7, 6, 2,
          6, 5, 7, 4, 3, 9, 8, 1, 1, 2, 3, 8, 6, 5, 7, 4, 9, 5, 8, 9, 3, 7, 4,
          6, 1, 2, 7, 4, 6, 1, 2, 9, 3, 5, 8,
        ],
        clearGrid: [
          9, 5, 0, 0, 0, 2, 0, 6, 7, 4, 7, 2, 0, 0, 0, 1, 0, 3, 0, 3, 8, 9, 0,
          0, 0, 2, 4, 0, 0, 7, 2, 0, 0, 0, 3, 5, 3, 0, 0, 5, 8, 1, 0, 7, 0, 0,
          0, 0, 0, 0, 3, 9, 0, 0, 0, 2, 0, 8, 0, 0, 0, 0, 0, 0, 8, 9, 0, 7, 0,
          0, 1, 2, 0, 0, 6, 0, 2, 0, 3, 5, 8,
        ],
      },
      {
        clearGrid: [
          6, 0, 0, 0, 0, 9, 0, 0, 2, 0, 4, 3, 1, 0, 2, 0, 9, 0, 2, 0, 1, 0, 0,
          8, 0, 6, 4, 9, 0, 0, 0, 0, 0, 8, 7, 1, 8, 0, 5, 7, 2, 0, 3, 0, 0, 4,
          3, 7, 0, 0, 1, 2, 0, 6, 0, 7, 0, 0, 5, 0, 6, 0, 0, 0, 0, 6, 9, 0, 3,
          4, 0, 0, 0, 2, 4, 0, 0, 0, 0, 0, 5,
        ],
        puzzleGrid: [
          6, 5, 8, 4, 7, 9, 1, 3, 2, 7, 4, 3, 1, 6, 2, 5, 9, 8, 2, 9, 1, 5, 3,
          8, 7, 6, 4, 9, 6, 2, 3, 4, 5, 8, 7, 1, 8, 1, 5, 7, 2, 6, 3, 4, 9, 4,
          3, 7, 8, 9, 1, 2, 5, 6, 1, 7, 9, 2, 5, 4, 6, 8, 3, 5, 8, 6, 9, 1, 3,
          4, 2, 7, 3, 2, 4, 6, 8, 7, 9, 1, 5,
        ],
      },
    ],
    hard: [
      {
        puzzleGrid: [
          3, 0, 6, 5, 0, 8, 4, 0, 0, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 7, 0, 0,
          0, 0, 3, 1, 0, 0, 3, 0, 1, 0, 0, 8, 0, 9, 0, 0, 8, 6, 3, 0, 0, 5, 0,
          5, 0, 0, 9, 0, 6, 0, 0, 1, 3, 0, 0, 0, 0, 2, 5, 0, 0, 0, 0, 0, 0, 0,
          0, 7, 4, 0, 0, 5, 2, 0, 6, 3, 0, 0,
        ],
        clearGrid: [],
      },
    ],
  };

  const selectedPuzzle = puzzles.easy[0].clearGrid;
  const getPuzzleReady = (p: number[]) => {
    const puzzle: number[][] = [[], [], [], [], [], [], [], [], []];
    p.forEach((num, index) => {
      puzzle.push;
      const idx = Math.floor(index / 9);
      puzzle[idx].push(num);
    });
    return puzzle;
  };

  let numbers = getPuzzleReady(selectedPuzzle);

  let rows = numbers.map((row) => {
    return row.map((col) => {
      const column: Cell = {
        value: col,
        isFixed: col !== 0 ? true : false,
        notes: [] as number[],
      };
      return column;
    });
  });

  const moveHandler = (direction: MoveType) => {
    switch (direction) {
      case "ArrowDown": {
        const row = selectedCell[0] + 1 !== 9 ? selectedCell[0] + 1 : 0;
        selectedCell = [row, selectedCell[1]];
        break;
      }
      case "ArrowLeft": {
        const col = selectedCell[1] - 1 !== -1 ? selectedCell[1] - 1 : 8;
        selectedCell = [selectedCell[0], col];
        break;
      }
      case "ArrowRight": {
        const col = selectedCell[1] + 1 !== 9 ? selectedCell[1] + 1 : 0;
        selectedCell = [selectedCell[0], col];
        break;
      }
      case "ArrowUp": {
        const row = selectedCell[0] - 1 !== -1 ? selectedCell[0] - 1 : 8;
        selectedCell = [row, selectedCell[1]];
        break;
      }
    }
    if (selectedCell[0] === -1) {
      selectedCell = [8, selectedCell[1]];
    }
    if (selectedCell[1] === -1) {
      selectedCell = [selectedCell[0], 8];
    }
  };

  const languageHandler = () => {
    lang = lang === "fa" ? "en" : "fa";
  };

  const timerToggleHandler = () => {
    isTimerShown = !isTimerShown;
  };

  const noteToggleHandler = () => {
    isNoteEnabled = !isNoteEnabled;
  };

  const menuClickHandler = () => {
    isMenuShown = !isMenuShown;
  };

  function isOfTypeMove(name: string): name is MoveType {
    return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(name);
  }

  const fillCellHandler = (num: number) => {
    if (selectedCell[0] !== -1) {
      const cell = rows[selectedCell[0]][selectedCell[1]];
      if (isNoteEnabled) {
        if (cell.notes.includes(num)) {
          actions = [
            ...actions,
            {
              isNote: true,
              position: [...selectedCell],
              value: [...cell.notes],
            },
          ];
          const index = cell.notes.findIndex((note) => note === num);
          rows[selectedCell[0]][selectedCell[1]].notes.splice(index, 1);
        } else {
          if (cell.notes.length) {
            actions = [
              ...actions,
              {
                isNote: true,
                position: [...selectedCell],
                value: [...cell.notes],
              },
            ];
          } else {
            actions = [
              ...actions,
              {
                isNote: false,
                position: [...selectedCell],
                value: cell.value,
              },
            ];
          }
          rows[selectedCell[0]][selectedCell[1]].notes.push(num);
        }
        rows[selectedCell[0]][selectedCell[1]].value = 0;
      } else {
        if (cell.notes.length) {
          actions = [
            ...actions,
            {
              isNote: true,
              position: [...selectedCell],
              value: [...cell.notes],
            },
          ];
        } else {
          actions = [
            ...actions,
            {
              isNote: false,
              position: [...selectedCell],
              value: cell.value,
            },
          ];
        }
        rows[selectedCell[0]][selectedCell[1]].value = num;
        rows[selectedCell[0]][selectedCell[1]].notes = [];
      }
    }
    redoActions = [];
  };

  const keyboardHandler = (e: KeyboardEvent) => {
    e.preventDefault();
    const name = e.key;
    if (selectedCell[0] !== -1) {
      if (isOfTypeMove(name)) {
        moveHandler(name);
        return;
      }
      const isFixed = rows[selectedCell[0]][selectedCell[1]].isFixed;
      if (numKeys.includes(parseInt(name))) {
        if (!isFixed) {
          fillCellHandler(parseInt(name));
        }
      } else if (farsiNumKeys.includes(name)) {
        const index = farsiNumKeys.findIndex((num) => num === name);
        if (!isFixed) {
          fillCellHandler(numKeys[index]);
        }
      } else if (name === "Escape") {
        selectedCell = [-1, -1];
        return;
      } else if (name === "Delete" || name === "BackSpace") {
        deleteHandler();
      } else if (name === "n") {
        isNoteEnabled = !isNoteEnabled;
      }
    }
  };

  const deleteHandler = () => {
    const cell = rows[selectedCell[0]][selectedCell[1]];
    if (cell.isFixed) {
      return;
    }
    if (cell.notes.length) {
      actions = [
        ...actions,
        {
          isNote: true,
          position: [...selectedCell],
          value: [...cell.notes],
        },
      ];
    } else {
      actions = [
        ...actions,
        {
          isNote: false,
          position: [...selectedCell],
          value: cell.value,
        },
      ];
    }
    rows[selectedCell[0]][selectedCell[1]].value = 0;
    rows[selectedCell[0]][selectedCell[1]].notes = [];
    redoActions = [];
  };

  const actionHandler = (action: Action) => {
    if (action.isNote) {
      rows[action.position[0]][action.position[1]].value = 0;
      rows[action.position[0]][action.position[1]].notes = [
        ...(action.value as number[]),
      ];
    } else {
      rows[action.position[0]][action.position[1]].notes = [];
      rows[action.position[0]][action.position[1]].value =
        action.value as number;
    }
    selectedCell = [...action.position];
  };

  const redo = () => {
    if (!redoActions.length) {
      return;
    }
    const action = redoActions.pop();
    const cell = rows[action.position[0]][action.position[1]];
    if (cell.notes.length) {
      actions = [
        ...actions,
        { value: cell.notes, position: [...action.position], isNote: true },
      ];
    } else {
      actions = [
        ...actions,
        { value: cell.value, position: [...action.position], isNote: false },
      ];
    }
    actionHandler(action);
    redoActions = redoActions;
  };

  const undo = () => {
    if (!actions.length) {
      return;
    }
    const action = actions.pop();
    const cell = rows[action.position[0]][action.position[1]];
    if (cell.notes.length) {
      redoActions = [
        ...redoActions,
        { value: cell.notes, position: [...action.position], isNote: true },
      ];
    } else {
      redoActions = [
        ...redoActions,
        { value: cell.value, position: [...action.position], isNote: false },
      ];
    }
    actionHandler(action);
    actions = actions;
  };

  addEventListener("keydown", keyboardHandler);

  onDestroy(() => {
    removeEventListener("keydown", keyboardHandler);
    clearInterval(timer);
  });

  const handleClick = (rowIndex: number, colIndex: number) => {
    selectedCell = [rowIndex, colIndex];
  };

  const selectBoxHandler = () => {
    const boxRowId = Math.floor(selectedCell[0] / 3) * 3;
    const boxColumnId = Math.floor(selectedCell[1] / 3) * 3;
    selectedBox.rows = [];
    selectedBox.columns = [];
    for (let i = 0; i < 3; i++) {
      selectedBox.rows.push(boxRowId + i);
      selectedBox.columns.push(boxColumnId + i);
    }
  };

  // watches the selectCell and calls selectBoxHandler when its values changes
  $: selectBoxHandler(), [selectedCell];

  const notePositionHandler = (note: number) => {
    switch (note) {
      case 1:
        return "--x: -1; --y: -1;";
      case 2:
        return "--x: 0; --y: -1;";
      case 3:
        return "--x: 1; --y: -1;";
      case 4:
        return "--x: -1; --y: 0;";
      case 5:
        return "--x: 0; --y: 0;";
      case 6:
        return "--x: 1; --y: 0;";
      case 7:
        return "--x: -1; --y: 1;";
      case 8:
        return "--x: 0; --y: 1;";
      case 9:
        return "--x: 1; --y: 1;";
    }
  };
</script>

<Header
  {menuClickHandler}
  {isMenuShown}
  {lang}
  {isTimerShown}
  {timerToggleHandler}
  {undo}
  {actions}
  {redoActions}
  {redo}
  {languageHandler}
/>
<div
  class={`flex max-w-[400px] mx-auto align-middle justify-between select-none ${
    lang === "fa" ? "font-vazir sample_farsi_digits" : "font-poppins"
  }`}
>
  <div class="flex items-center justify-between w-full " />
</div>
<div class="h-[10px]" />
<div
  class={`mx-auto w-full flex justify-center ${
    isTimerShown ? "opacity-100" : "opacity-0"
  }`}
>
  <div
    class={`px-3 w-20 text-gray-500 select-none text-2xl font-bold ${
      lang === "fa" ? "font-vazir sample_farsi_digits" : "font-poppins"
    }`}
  >
    {leftTime[0] === "00" ? leftTime.slice(1).join(":") : leftTime.join(":")}
  </div>
</div>
<div class="h-[30px]" />

<Board
  {lang}
  {rows}
  {handleClick}
  {selectedCell}
  {selectedBox}
  {notePositionHandler}
/>

<InputNumbers
  {deleteHandler}
  {isNoteEnabled}
  {noteToggleHandler}
  {lang}
  {numKeys}
  {selectedCell}
  {rows}
  {fillCellHandler}
/>
