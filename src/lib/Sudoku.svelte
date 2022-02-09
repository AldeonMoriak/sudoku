<script lang="ts">
  import { onDestroy } from "svelte";

  let lang: "fa" | "en" = "fa";
  let selectedCell = [-1, -1];
  let selectedBox = {
    rows: [],
    columns: [],
  };
  let isNoteEnabled = false;

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const farsiNumKeys = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  const numbers = [
    [3, 0, 6, 5, 0, 8, 4, 0, 0],
    [5, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 7, 0, 0, 0, 0, 3, 1],
    [0, 0, 3, 0, 1, 0, 0, 8, 0],
    [9, 0, 0, 8, 6, 3, 0, 0, 5],
    [0, 5, 0, 0, 9, 0, 6, 0, 0],
    [1, 3, 0, 0, 0, 0, 2, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 7, 4],
    [0, 0, 5, 2, 0, 6, 3, 0, 0],
  ];

  let rows = numbers.map((row) => {
    return row.map((col) => {
      const column = {
        value: col,
        isFixed: col !== 0 ? true : false,
        notes: [] as number[],
      };
      return column;
    });
  });

  type MoveType = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

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

  const noteToggleHandler = () => {
    isNoteEnabled = !isNoteEnabled;
  };

  function isOfTypeMove(name: string): name is MoveType {
    return ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(name);
  }

  const fillCellHandler = (num: number) => {
    if (selectedCell[0] !== -1) {
      if (isNoteEnabled) {
        rows[selectedCell[0]][selectedCell[1]].value = 0;
        const notes = rows[selectedCell[0]][selectedCell[1]].notes;
        if (notes.includes(num)) {
          const index = notes.findIndex((note) => note === num);
          rows[selectedCell[0]][selectedCell[1]].notes.splice(index, 1);
        } else {
          rows[selectedCell[0]][selectedCell[1]].notes.push(num);
        }
      } else {
        rows[selectedCell[0]][selectedCell[1]].value = num;
        rows[selectedCell[0]][selectedCell[1]].notes = [];
      }
    }
  };

  const keyboardHandler = (e: KeyboardEvent) => {
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
      } else if (
        (name === "Delete" ||
          name === "BackSpace" ||
          name === "0" ||
          name === "۰") &&
        !isFixed
      ) {
        rows[selectedCell[0]][selectedCell[1]].value = 0;
      }
    }
  };

  addEventListener("keydown", keyboardHandler);

  onDestroy(() => {
    removeEventListener("keydown", keyboardHandler);
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

<div class="h-[100px]" />
<div
  class={`flex flex-col max-w-[400px] mx-auto align-middle justify-center border-2 border-black select-none ${
    lang === "fa" ? "font-vazir sample_farsi_digits" : ""
  }`}
>
  {#each rows as row, rowIndex}
    <div
      class={`grid grid-cols-9 text-center ${
        rowIndex === 5 || rowIndex === 2
          ? "border-b-2 border-b-black"
          : rowIndex !== 8
          ? "border-b border-b-black"
          : ""
      }`}
    >
      {#each row as cell, colIndex}
        <div
          on:click={() => handleClick(rowIndex, colIndex)}
          class={`w-full p-1 h-full text-black font-semibold text-3xl  ${
            colIndex === 2 || colIndex === 5
              ? "border-r-2 border-r-black"
              : colIndex !== 8
              ? "border-r border-r-black"
              : ""
          } ${
            cell.isFixed
              ? "text-black cursor-default bg-neutral-200"
              : "text-blue-400 cursor-pointer bg-white"
          } ${
            selectedCell.join("") === [rowIndex, colIndex].join("")
              ? !cell.notes.length
                ? "with-stroke text-cyan-500 bg-blue-400/90"
                : "bg-gray-900"
              : selectedCell[0] !== -1 &&
                rows[selectedCell[0]][selectedCell[1]]?.value === cell.value &&
                !cell.notes.length
              ? "with-stroke text-cyan-500"
              : ""
          } ${
            selectedCell[0] === rowIndex ||
            selectedCell[1] === colIndex ||
            (selectedBox.rows.includes(rowIndex) &&
              selectedBox.columns.includes(colIndex))
              ? cell.isFixed
                ? "bg-blue-200"
                : "bg-blue-100/50"
              : ""
          } ${cell.notes.length ? "flex items-center justify-center" : ""}`}
        >
          <!-- <svelte:component this={numSvgs[cell.value]} /> -->
          {#if cell.value}
            {cell.value}
          {:else if cell.notes.length}
            {#each cell.notes as note}
              <span
                class={`text-xs  absolute flex items-center justify-center note-position ${
                  selectedCell[0] !== -1 &&
                  rows[selectedCell[0]][selectedCell[1]]?.value === note
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
                style={notePositionHandler(note)}>{note}</span
              >
            {/each}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>

<div dir="rtl" class="max-w-[400px] mx-auto grid grid-cols-9 text-center mt-4">
  <div
    class={`bg-gray-800 text-white border-2 border-white rounded-lg py-2  text-xl cursor-pointer flex justify-center ${
      isNoteEnabled ? "bg-yellow-200 text-gray-800 border-gray-800" : ""
    }`}
    on:click={noteToggleHandler}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  </div>
</div>

<div
  class={`max-w-[400px] mx-auto grid grid-cols-9 text-center mt-4  ${
    lang === "fa" ? "font-vazir sample_farsi_digits" : ""
  }`}
>
  {#each numKeys as num}
    <div
      class={`bg-gray-800 text-white border-2 border-white rounded-lg py-2 px-1 text-2xl font-bold cursor-pointer select-none ${
        isNoteEnabled
          ? selectedCell[0] !== -1 &&
            rows[selectedCell[0]][selectedCell[1]]?.notes.includes(num)
            ? "bg-yellow-200 text-gray-800 border-gray-800"
            : "bg-gray-200  text-gray-800 border-gray-800"
          : ""
      }`}
      on:click={() => fillCellHandler(num)}
    >
      {num}
    </div>
  {/each}
</div>

<style>
  .with-stroke {
    -webkit-text-stroke: 0.05em black;
  }

  .sample_farsi_digits {
    -moz-font-feature-settings: "ss01";
    -webkit-font-feature-settings: "ss01";
    font-feature-settings: "ss01";
  }

  .note-position {
    /* transform: translate(calc(12px * var(--x)), calc(12px * var(--y))); */
    transform: translate(calc(15px * var(--x)), calc(15px * var(--y)));
  }
</style>
