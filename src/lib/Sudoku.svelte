<script lang="ts">
  import type { Action } from "src/types/Action";
  import type { Box } from "src/types/Box";
  import type { Cell } from "src/types/Cell";
  import type { Lang } from "src/types/Lang";
  import type { MoveType } from "src/types/MoveType";
  import type { FarsiPuzzleType, PuzzleType } from "src/types/PuzzleType";
  import { onDestroy } from "svelte";
  import Board from "../components/Board.svelte";
  import Header from "../components/Header.svelte";
  import InputNumbers from "../components/InputNumbers.svelte";
  import { getPuzzleOfTheDay } from "../helpers/puzzles";
  import { clickOutside } from "../helpers/clickOutside";

  let lang: Lang = "en";
  let selectedCell: [number, number] = [-1, -1];
  let selectedBox: Box = {
    rows: [],
    columns: [],
  };
  let isNoteEnabled = false;
  let isTimerShown = true;
  let isMenuShown = false;
  let isTypesMenuShown = false;

  let actions: Action[] = [];
  let redoActions: Action[] = [];
  $: innerHeight = 0;

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const farsiNumKeys = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  let leftTime = ["00", "00", "00"];
  let startDate = Date.now();

  const timerHandler = () => {
    const seconds = Date.now() - startDate;
    leftTime = toStringTime(seconds);
  };

  let timer = setInterval(timerHandler, 500);

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

  let difficulty: { en: PuzzleType; fa: FarsiPuzzleType } = {
    en: "easy",
    fa: "آسان",
  };
  let difficultyList: { en: PuzzleType; fa: FarsiPuzzleType }[] = [
    { fa: "آسان", en: "easy" },
    { fa: "متوسط", en: "medium" },
    { fa: "سخت", en: "hard" },
    { fa: "حرفه ای", en: "expert" },
    { fa: "وحشیانه", en: "evil" },
  ];
  let puzzleOfTheDay = getPuzzleOfTheDay(difficulty.en);
  let selectedPuzzle = puzzleOfTheDay.clearGrid;

  const changePuzzleDifficulty = (type: {
    en: PuzzleType;
    fa: FarsiPuzzleType;
  }) => {
    difficulty = type;
  };
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
  let rows: Cell[][] = [];

  const typeMenuOpenHandler = () => {
    isTypesMenuShown = true;
  };

  const typeMenuCloseHandler = () => {
    isTypesMenuShown = false;
  };

  const onChangeDifficulty = () => {
    clearInterval(timer);
    startDate = Date.now();
    timer = setInterval(timerHandler, 500);
    typeMenuCloseHandler();
    puzzleOfTheDay = getPuzzleOfTheDay(difficulty.en);
    selectedPuzzle = puzzleOfTheDay.clearGrid;
    numbers = getPuzzleReady(selectedPuzzle);
    rows = rowsHandler(numbers);
  };

  const rowsHandler = (numbers: number[][]) => {
    return numbers.map((row) => {
      return row.map((col) => {
        const column: Cell = {
          value: col,
          isFixed: col !== 0 ? true : false,
          notes: [] as number[],
        };
        return column;
      });
    });
  };
  rows = rowsHandler(numbers);

  $: onChangeDifficulty(), difficulty;

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

  const menuOpenHandler = () => {
    isMenuShown = true;
  };

  const menuCloseHandler = () => {
    isMenuShown = false;
  };

  function isOfTypeMove(name: string): name is MoveType {
    return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(name);
  }

  const fillCellHandler = (num: number) => {
    if (selectedCell[0] !== -1) {
      const cell = rows[selectedCell[0]][selectedCell[1]];
      if (cell.isFixed) {
        return;
      }
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
      redoActions = [];
      checkIsGameDone();
    }
  };

  const checkIsGameDone = () => {
    const isGameDone =
      rows
        .map((el) => el.map((r) => r.value))
        .flat()
        .join("") === puzzleOfTheDay.puzzleGrid.join("");
    if (isGameDone) {
      const message =
        lang === "fa"
          ? "ایول بازی تموم شد\n" + leftTime.join(":") + " طول کشید."
          : "Well done!\n" + leftTime.join(":") + " took to finish the game.";
      alert(message);
      clearInterval(timer);
    }
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
        handleClick(-1, -1);
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
<svelte:window bind:innerHeight />

<Header
  {typeMenuOpenHandler}
  {isTypesMenuShown}
  {typeMenuCloseHandler}
  {changePuzzleDifficulty}
  {difficulty}
  {difficultyList}
  {menuOpenHandler}
  {menuCloseHandler}
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
{#if innerHeight > 650}
  <div
    class={`flex max-w-[400px] w-full mx-auto align-middle justify-between select-none ${
      lang === "fa" ? "font-vazir sample_farsi_digits" : "font-poppins"
    }`}
  >
    <div class="h-[10px]" />
    <div
      class={`mx-auto w-full flex justify-center ${
        isTimerShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div class="px-3 w-20 text-gray-500 select-none text-2xl font-bold">
        {leftTime[0] === "00"
          ? leftTime.slice(1).join(":")
          : leftTime.join(":")}
      </div>
    </div>
  </div>
{/if}
<div class="h-[10px]" />
<div
  class="max-w-[400px] w-full mx-auto"
  use:clickOutside
  on:click_outside={() => handleClick(-1, -1)}
>
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
</div>
