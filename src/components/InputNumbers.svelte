<script lang="ts">
  import type { Cell } from "src/types/Cell";

  import type { Lang } from "src/types/Lang";

  export let isNoteEnabled: boolean;
  export let noteToggleHandler: () => void;
  export let lang: Lang;
  export let numKeys: number[];
  export let selectedCell: [number, number];
  export let rows: Cell[][];
  export let fillCellHandler: (num: number) => void;
  export let deleteHandler: () => void;
</script>

<div dir="rtl" class="max-w-[400px] mx-auto grid grid-cols-9 text-center mt-2">
  <div
    on:click={deleteHandler}
    class="border-2 rounded-lg py-2 text-xl cursor-pointer flex justify-center bg-gray-700 text-white  border-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
  <div
    class={` border-2 rounded-lg py-2  text-xl cursor-pointer flex justify-center ${
      isNoteEnabled
        ? "bg-yellow-200 text-gray-800 border-gray-800"
        : "bg-gray-700 text-white  border-white"
    }`}
    on:click={noteToggleHandler}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
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
