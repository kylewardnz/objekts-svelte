<script lang="ts">
  import { Check, Filter as FilterIcon, ListRestart, Maximize, Minimize } from 'lucide-svelte'
  import { Button } from '$components/ui/button'
  import type { Filter, Objekt } from '$lib/types'
  import { cn, generateFilters } from '$lib/utils'
  import { clickOutside } from 'svelte-use-click-outside'

  export let objekts: Objekt[]

  const availableFilters = generateFilters(objekts)

  let open = false
  export let filters: Filter[] = []
  export let mode: 'and' | 'or' = 'and'

  function select(filter: Filter) {
    if (filters.includes(filter)) {
      filters = filters.filter((f) => f !== filter)
    } else {
      filters = [...filters, filter]
    }
  }

  function reset() {
    filters = []
  }
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
  <Button
    on:click={() => (open = !open)}
    class={cn(
      'flex flex-row gap-2 w-fit text-base border-2 border-accent',
      filters.length > 0 && 'border-blue-500'
    )}
    variant="ghost"
  >
    <span>Filter</span>
    <div class="flex justify-center items-center w-4">
      {#if filters.length === 0}
        <FilterIcon class="w-4 h-4" />
      {:else}
        <span class="text-blue-500">{filters.length}</span>
      {/if}
    </div>
  </Button>

  {#if open}
    <div
      class="absolute w-48 z-10 flex flex-col bg-background -left-[5.5rem] rounded p-1 mt-[1px] text-accent-foreground text-sm border border-accent shadow animate-in slide-in-from-top-1"
    >
      <button
        class="flex gap-2 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all"
        on:click={reset}
      >
        <ListRestart class="h-5 w-5" /> Reset Filters
      </button>

      <div class="flex gap-1">
        <button
          class={cn(
            'w-full flex gap-2 items-center justify-center py-1 px-2 hover:bg-accent rounded transition-all',
            mode === 'and' && 'bg-accent'
          )}
          on:click={() => (mode = 'and')}
        >
          <Minimize class="h-5 w-5" />
        </button>

        <button
          class={cn(
            'w-full flex gap-2 items-center justify-center py-1 px-2 hover:bg-accent rounded transition-all',
            mode === 'or' && 'bg-accent'
          )}
          on:click={() => (mode = 'or')}
        >
          <Maximize class="h-5 w-5" />
        </button>
      </div>

      {#each availableFilters as filter}
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
            {filter.label}
          </span>
          <span class="flex justify-end">{filter.value}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
