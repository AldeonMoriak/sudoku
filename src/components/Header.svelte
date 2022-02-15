<script lang="ts">
  import type { Action } from "src/types/Action";
  import type { Lang } from "src/types/Lang";
  import type { FarsiPuzzleType, PuzzleType } from "src/types/PuzzleType";
  import { clickOutside } from "../helpers/clickOutside";

  import { fade } from "svelte/transition";
  export let menuOpenHandler: () => void;
  export let menuCloseHandler: () => void;
  export let isMenuShown: boolean;
  export let lang: Lang;
  export let isTimerShown: boolean;
  export let timerToggleHandler: () => void;
  export let undo: () => void;
  export let actions: Action[];
  export let redoActions: Action[];
  export let redo: () => void;
  export let languageHandler: () => void;
  export let difficultyList: { fa: FarsiPuzzleType; en: PuzzleType }[];
  export let difficulty: { en: PuzzleType; fa: FarsiPuzzleType };
  export let changePuzzleDifficulty: (type: {
    en: PuzzleType;
    fa: FarsiPuzzleType;
  }) => void;
  export let typeMenuOpenHandler: () => void;
  export let typeMenuCloseHandler: () => void;
  export let isTypesMenuShown: boolean;
</script>

<div
  class="flex max-w-[400px] w-full min-w-[350px] mx-auto align-middle justify-between select-none"
>
  <div use:clickOutside on:click_outside={menuCloseHandler}>
    <button
      type="button"
      class="text-gray-600"
      on:click={!isMenuShown ? menuOpenHandler : menuCloseHandler}
    >
      {#if !isMenuShown}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      {/if}
    </button>
    {#if isMenuShown}
      <div
        transition:fade
        class="z-50 origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        tabindex="-1"
      >
        <!-- Active: "bg-gray-100", Not Active: "" -->
        <label
          for="language"
          class={`flex items-center justify-between  cursor-pointer px-4 py-2 ${
            lang === "fa" ? "" : "flex-row-reverse"
          }`}
        >
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input
              id="language"
              type="checkbox"
              on:click={languageHandler}
              checked={lang === "fa"}
              class="sr-only peer"
            />
            <!-- line -->
            <div
              class="w-10 h-4 bg-gray-400 peer-checked:bg-blue-500 transition-colors delay-200 rounded-full shadow-inner"
            />
            <!-- dot -->
            <div
              class="flex items-center justify-center peer-checked:translate-x-full delay-100 absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <!-- label -->
          <div class="text-white font-medium font-poppins">
            {lang === "en" ? "English" : "فارسی"}
          </div>
        </label>
        <label
          for="timer"
          class={`flex items-center justify-between cursor-pointer px-4 py-2 ${
            lang === "fa" ? "" : "flex-row-reverse"
          }`}
        >
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input
              id="timer"
              type="checkbox"
              checked={isTimerShown}
              on:click={timerToggleHandler}
              class="sr-only peer"
            />
            <!-- line -->
            <div
              class="w-10 h-4 bg-gray-400 peer-checked:bg-blue-500 transition-colors delay-200 rounded-full shadow-inner"
            />
            <!-- dot -->
            <div
              class="flex items-center justify-center peer-checked:translate-x-full delay-100 absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <!-- label -->
          <div
            class={`text-white font-medium ${
              lang === "fa" ? "font-vazir" : "font-poppins"
            }`}
          >
            {lang === "fa" ? "تایمر" : "Timer"}
          </div>
        </label>
      </div>
    {/if}
  </div>
  <div
    class={lang === "fa" ? "font-vazir" : "font-poppins"}
    use:clickOutside
    on:click_outside={typeMenuCloseHandler}
  >
    <div
      class="cursor-pointer  text-gray-500 text-base"
      dir={lang === "fa" ? "rtl" : "ltr"}
    >
      {#if isTypesMenuShown}
        <div on:click={typeMenuCloseHandler}>
          {lang === "fa" ? difficulty.fa : difficulty.en}
          <svg
            class="w-5 h-5 inline "
            version="1.1"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 32 32"
            style="enable-background:new 0 0 32 32;"
            xml:space="preserve"
          >
            <style type="text/css">
              .st0 {
                fill: none;
              }
            </style>
            <polygon points="16,10 26,20 24.6,21.4 16,12.8 7.4,21.4 6,20 " />
            <rect
              id="_x3C_Transparent_Rectangle_x3E_"
              class="st0"
              width="32"
              height="32"
            />
          </svg>
        </div>
      {:else}
        <div on:click={typeMenuOpenHandler}>
          {lang === "fa" ? difficulty.fa : difficulty.en}
          <svg
            class="w-5 h-5 inline"
            version="1.1"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 32 32"
            style="enable-background:new 0 0 32 32;"
            xml:space="preserve"
          >
            <style type="text/css">
              .st0 {
                fill: none;
              }
            </style>
            <polygon points="16,22 6,12 7.4,10.6 16,19.2 24.6,10.6 26,12 " />
            <rect
              id="_x3C_Transparent_Rectangle_x3E_"
              class="st0"
              width="32"
              height="32"
            />
          </svg>
        </div>
      {/if}
    </div>
    {#if isTypesMenuShown}
      <div
        transition:fade
        class="z-50 absolute mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <ul dir={lang === "fa" ? "rtl" : "ltr"}>
          {#each difficultyList.slice(0, 3) as difficulty, index ("difficulty" + index)}
            <li
              on:click={() => changePuzzleDifficulty(difficulty)}
              class="block px-4 py-2 text-base font-medium text-gray-200 hover:bg-gray-600 cursor-pointer"
            >
              {lang === "fa" ? difficulty.fa : difficulty.en}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
  <div class="">
    <button
      type="button"
      on:click={undo}
      class=" disabled:opacity-50 select-none outline-none"
      disabled={!actions.length}
    >
      <svg
        id="Layer_1"
        class="w-7 h-7"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <defs>
          <style>
            .cls-1 {
              fill: none;
            }
          </style>
        </defs>
        <path
          d="M20,10H7.8149l3.5874-3.5859L10,5,4,11,10,17l1.4023-1.4146L7.8179,12H20a6,6,0,0,1,0,12H12v2h8a8,8,0,0,0,0-16Z"
        />
        <rect
          id="_Transparent_Rectangle_"
          data-name="&lt;Transparent Rectangle&gt;"
          class="cls-1"
          width="32"
          height="32"
        />
      </svg>
    </button>
    <button
      type="button"
      on:click={redo}
      class=" disabled:opacity-50 select-none outline-none "
      disabled={!redoActions.length}
    >
      <svg
        id="Layer_1"
        data-name="Layer 1"
        class="w-7 h-7"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <defs>
          <style>
            .cls-1 {
              fill: none;
            }
          </style>
        </defs>
        <path
          d="M12,10H24.1851L20.5977,6.4141,22,5,28,11,22,17l-1.4023-1.4146L24.1821,12H12a6,6,0,0,0,0,12h8v2H12a8,8,0,0,1,0-16Z"
          transform="translate(0 0)"
        />
        <rect
          id="_Transparent_Rectangle_"
          data-name="&lt;Transparent Rectangle&gt;"
          class="cls-1 text-gray-600"
          width="32"
          height="32"
        />
      </svg>
    </button>
  </div>
</div>
