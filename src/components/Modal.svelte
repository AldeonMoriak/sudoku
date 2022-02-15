<script lang="ts">
  import type { Lang } from "src/types/Lang";

  export let message: string[];
  export let title: string;
  export let closeButton: string;
  export let closeModal: () => void;
  export let isModalShown: boolean;
  export let lang: Lang;
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
{#if isModalShown}
  <div
    dir={lang === "fa" ? "rtl" : "ltr"}
    class={`fixed z-10 inset-0 overflow-y-auto ${
      lang === "fa" ? "font-vazir sample_farsi_digits" : "font-poppins"
    }
`}
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      />

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-green-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div
              class={`mt-3 sm:mt-0  ${
                lang === "fa"
                  ? "sm:mr-4 sm:text-right text-right"
                  : "sm:ml-4 sm:text-left text-left"
              }`}
            >
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
              <div class="mt-2">
              {#each message as p}
                <p class="text-sm text-gray-600">{p}</p>
                {/each}
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            on:click={closeModal}
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >{closeButton}</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
