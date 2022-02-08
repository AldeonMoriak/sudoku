<script lang="ts">
  import { onDestroy } from "svelte";
  import one from "../components/one.svelte";
  import two from "../components/two.svelte";
  import three from "../components/three.svelte";
  import four from "../components/four.svelte";
  import five from "../components/five.svelte";
  import six from "../components/six.svelte";
  import seven from "../components/seven.svelte";
  import eight from "../components/eight.svelte";
  import nine from "../components/nine.svelte";
  import { clear_loops } from "svelte/internal";

  const numSvgs = {
    1: one,
    2: two,
    3: three,
    4: four,
    5: five,
    6: six,
    7: seven,
    8: eight,
    9: nine,
  };

  let count: number = 0;
  const increment = () => {
    count += 1;
  };

  const numKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

  const rows = numbers.map((row) => {
    return row.map((col) => {
      const column = {
        value: col,
        isFixed: col !== 0 ? true : false,
      };
      return column;
    });
  });

  const keyboardHandler = (e: KeyboardEvent) => {
    const name = e.key;
    if (numKeys.includes(parseInt(name))) console.log(name);
  };

  addEventListener("keydown", keyboardHandler);

  onDestroy(() => {
    removeEventListener("keydown", keyboardHandler);
  });

  let selectedCell = [-1, -1];

  const handleClick = (rowIndex: number, colIndex: number) => {
    selectedCell = [rowIndex, colIndex];
  };
</script>

<div class="h-[200px]" />
<div class="flex flex-col max-w-[400px] mx-auto align-middle justify-center ">
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
          class={`w-full p-2 h-full text-black font-semibold text-xl ${
            colIndex === 2 || colIndex === 5
              ? "border-r-2 border-r-black"
              : colIndex !== 8
              ? "border-r border-r-black"
              : ""
          } ${
            cell.isFixed
              ? "text-black cursor-default"
              : "text-blue-400 cursor-pointer"
          } ${
            selectedCell.join("") === [rowIndex, colIndex].join("")
              ? "bg-blue-200"
              : selectedCell[0] !== -1 &&
                rows[selectedCell[0]][selectedCell[1]]?.value === cell.value
              ? "text-red-300"
              : ""
          } `}
        >
          <!-- <svelte:component this={numSvgs[cell.value]} /> -->
          {cell.value !== 0 ? cell.value : ""}
        </div>
      {/each}
    </div>
  {/each}
</div>
