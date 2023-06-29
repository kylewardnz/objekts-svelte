<script lang="ts">
  import { Check, Filter as FilterIcon, ListRestart } from 'lucide-svelte'
  import { Button } from './ui/button'
  import type { Filter, Objekt } from '$lib/types'
  import { cn, generateFilters } from '$lib/utils'
  import { createEventDispatcher } from 'svelte'
  import { clickOutside } from 'svelte-use-click-outside'

  export let objekts: Objekt[]

  const availableFilters = generateFilters(objekts)

  const dispatch = createEventDispatcher()

  let open = false
  let selectedFilters: Filter[] = []

  function select(filter: Filter) {
    if (selectedFilters.includes(filter)) {
      selectedFilters = selectedFilters.filter((f) => f !== filter)
    } else {
      selectedFilters = [...selectedFilters, filter]
    }

    dispatch('filter', selectedFilters)
  }

  function reset() {
    selectedFilters = []
    dispatch('filter', selectedFilters)
  }
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
  <Button
    on:click={() => (open = !open)}
    class={cn(
      'flex flex-row gap-2 w-fit text-base border-2 border-transparent',
      selectedFilters.length > 0 && 'border-blue-500'
    )}
    variant="ghost"
  >
    <span>Filter</span>
    <div class="flex justify-center items-center w-4">
      {#if selectedFilters.length === 0}
        <FilterIcon class="w-4 h-4" />
      {:else}
        <span class="text-blue-500">{selectedFilters.length}</span>
      {/if}
    </div>
  </Button>

  {#if open}
    <div
      class="absolute w-48 z-50 flex flex-col bg-background -left-[5.5rem] rounded p-1 mt-[1px] text-accent-foreground text-sm border border-accent shadow animate-in slide-in-from-top-1"
    >
      <button
        class="flex gap-2 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all"
        on:click={reset}
      >
        <ListRestart class="h-4 w-4" /> Reset Filters
      </button>

      {#each availableFilters as filter}
        <button
          class="w-full grid grid-cols-4 gap-4 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all capitalize"
          on:click={() => select(filter)}
        >
          <span class="flex justify-start gap-2 items-center font-semibold col-span-3">
            {#if selectedFilters.includes(filter)}
              <Check class="h-4 w-4" />
            {:else}
              <div class="h-4 w-4" />
            {/if}
            {filter.label}
          </span>
          <span class="flex justify-end">{filter.value}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
