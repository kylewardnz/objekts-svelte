<script lang="ts">
  import { Check, ChevronDown, ListRestart, X } from 'lucide-svelte'
  import { Button } from '$components/ui/button'
  import type { Objekt } from '$lib/types'
  import { cn, generateCollectionFilters } from '$lib/utils'
  import { clickOutside } from 'svelte-use-click-outside'

  export let objekts: Objekt[]
  export let filters: string[] = []

  const availableFilters = generateCollectionFilters(objekts)

  let open = false
  let search = ''
  let searchInput: HTMLInputElement

  $: displayCollections = availableFilters.filter((filter) =>
    filter.toLowerCase().includes(search.toLowerCase())
  )

  function select(filter: string) {
    if (filters.includes(filter)) {
      filters = filters.filter((f) => f !== filter)
    } else {
      filters = [...filters, filter]
    }
  }

  function reset() {
    filters = []
    search = ''
  }

  function clearSearch() {
    search = ''
    searchInput.focus()
  }
</script>

<div class="relative md:order-first" use:clickOutside={() => (open = false)}>
  <Button
    on:click={() => (open = !open)}
    class={cn(
      'flex flex-row gap-2 w-fit text-base border-2 border-accent',
      filters.length > 0 && 'border-blue-500'
    )}
    variant="ghost"
  >
    <span>Collections</span>
    <div class="flex justify-center items-center w-4">
      {#if filters.length === 0}
        <ChevronDown class="w-4 h-4" />
      {:else}
        <span class="text-blue-500">{filters.length}</span>
      {/if}
    </div>
  </Button>

  {#if open}
    <div
      class="absolute w-36 h-fit max-h-60 overflow-y-scroll z-10 flex flex-col bg-background rounded p-1 mt-[1px] text-accent-foreground text-sm border border-accent shadow animate-in slide-in-from-top-1"
    >
      <!-- search input -->
      <div class="flex flex-col w-full">
        <input
          bind:value={search}
          bind:this={searchInput}
          spellcheck="false"
          autocomplete="off"
          name="collectionSearch"
          type="text"
          placeholder="Search..."
          class="peer w-full bg-transparent focus:outline-none text-sm py-1 px-2"
        />
        <button on:pointerdown|preventDefault={clearSearch} class="absolute right-2 top-2 h-5 w-5">
          <X class="h-5 w-5" />
        </button>
        <span class="block h-[1px] max-w-0 bg-blue-500 duration-300 peer-focus:max-w-full" />
      </div>

      <!-- reset button -->
      <button
        class="flex gap-2 items-center justify-between py-1 px-2 hover:bg-accent hover:rounded transition-all"
        on:click={reset}
      >
        <ListRestart class="h-5 w-5" /> Reset
      </button>

      {#each displayCollections as filter}
        <button
          class="w-full grid grid-cols-4 gap-4 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all capitalize"
          on:click={() => select(filter)}
        >
          <span class="flex justify-start gap-2 items-center font-semibold col-span-3">
            {#if filters.includes(filter)}
              <Check class="h-5 w-5" />
            {:else}
              <div class="h-5 w-5" />
            {/if}
          </span>
          <span class="flex justify-end">{filter}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
