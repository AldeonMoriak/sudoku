<script lang="ts">
import type { Cell } from "src/types/Cell";

import type { Lang } from "src/types/Lang";


  export let isNoteEnabled: boolean;
  export let noteToggleHandler: () => void;
  export let lang: Lang;
  export let numKeys: number[];
  export let selectedCell: [number,number];
  export let rows: Cell[][];
  export let fillCellHandler: (num: number) => void;
</script>

<div dir="rtl" class="max-w-[400px] mx-auto grid grid-cols-9 text-center mt-2">
  <div
    class={` border-2 rounded-lg py-2  text-xl cursor-pointer flex justify-center ${
      isNoteEnabled
        ? "bg-yellow-200 text-gray-800 border-gray-800"
        : "bg-gray-800 text-white  border-white"
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
  class={`max-w-[400px] mx-auto grid grid-cols-9 text-center mt-2  ${
    lang === "fa" ? "font-vazir sample_farsi_digits" : "font-poppins"
  }`}
>
  {#each numKeys as num, numIndex ("num" + numIndex)}
    <div
      class={` border-2 rounded-lg py-2 px-1 text-2xl font-bold cursor-pointer select-none ${
        isNoteEnabled
          ? selectedCell[0] !== -1 &&
            rows[selectedCell[0]][selectedCell[1]]?.notes.includes(num)
            ? "bg-yellow-200 text-gray-800 border-gray-800"
            : "bg-gray-200  text-gray-800 border-gray-800"
          : selectedCell[0] !== -1 &&
            rows[selectedCell[0]][selectedCell[1]].value === num
          ? "bg-gray-100 text-gray-800 border-gray-800"
          : "bg-gray-800 text-white  border-white"
      } ${
        selectedCell[0] !== -1 && rows[selectedCell[0]][selectedCell[1]].isFixed
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      on:click={() => fillCellHandler(num)}
    >
      {num}
    </div>
  {/each}
</div>