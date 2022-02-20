<script lang="ts">
  import type { Box } from "src/types/Box";
  import type { Cell } from "src/types/Cell";
  import type { Lang } from "src/types/Lang";

  export let lang: Lang;
  export let rows: Cell[][];
  export let completedRows: Cell[][];
  export let handleClick: (rowIndex: number, colIndex: number) => void;
  export let selectedCell: [number, number];
  export let selectedBox: Box;
  export let notePositionHandler: (note: number) => string;
  export let isCheckerOn: boolean;
</script>

<div
  class={`flex flex-col max-w-[400px] min-w-[350px] w-full mx-auto align-middle justify-center border-2 border-black select-none ${
    lang === "fa" ? "font-vazir sample_farsi_digits" : "font-poppins"
  }`}
>
  {#each rows as row, rowIndex ("row" + rowIndex)}
    <div
      class={`grid grid-cols-9 text-center ${
        rowIndex === 5 || rowIndex === 2
          ? "border-b-4 border-b-black"
          : rowIndex !== 8
          ? "border-b border-b-black"
          : ""
      }`}
    >
      {#each row as cell, colIndex ("column" + colIndex)}
        <div
          on:click={() => handleClick(rowIndex, colIndex)}
          class={`w-full p-1 min-h-[44px] h-full text-black font-bold text-3xl ${
            colIndex === 2 || colIndex === 5
              ? "border-r-4 border-r-black"
              : colIndex !== 8
              ? "border-r border-r-black"
              : ""
          } ${
            cell.isFixed
              ? "text-black cursor-default bg-gray-300"
              : "text-black cursor-pointer bg-white"
          } ${
            selectedCell.join("") === [rowIndex, colIndex].join("")
              ? !cell.notes.length
                ? "with-stroke text-cyan-500 bg-gray-900"
                : "bg-gray-900"
              : selectedCell[0] !== -1 &&
                rows[selectedCell[0]][selectedCell[1]]?.value === cell.value &&
                !cell.notes.length
              ? "with-stroke text-cyan-500"
              : ""
          } ${
            selectedCell.join("") !== [rowIndex, colIndex].join("") &&
            (selectedCell[0] === rowIndex ||
              selectedCell[1] === colIndex ||
              (selectedBox.rows.includes(rowIndex) &&
                selectedBox.columns.includes(colIndex)))
              ? cell.isFixed
                ? "bg-blue-200"
                : selectedCell[0] !== -1 &&
                  cell.notes.includes(
                    rows[selectedCell[0]][selectedCell[1]]?.value
                  )
                ? "bg-yellow-100"
                : "bg-blue-100"
              : ""
          } ${cell.notes.length ? "flex items-center justify-center" : ""} ${
            selectedCell[0] !== -1 &&
            cell.notes.includes(rows[selectedCell[0]][selectedCell[1]]?.value)
              ? "bg-yellow-100"
              : ""
          } ${
            cell.value !== 0 && isCheckerOn
              ? completedRows[rowIndex][colIndex].value !== cell.value
                ? "text-red-500"
                : ""
              : ""
          }`}
        >
          <!-- <svelte:component this={numSvgs[cell.value]} /> -->
          {#if cell.value}
            {cell.value}
          {:else if cell.notes.length}
            {#each cell.notes as note ("note" + rowIndex + colIndex + note)}
              <span
                class={`text-xs  absolute flex items-center justify-center note-position ${
                  selectedCell[0] !== -1 &&
                  rows[selectedCell[0]][selectedCell[1]]?.value === note
                    ? "text-yellow-600"
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
