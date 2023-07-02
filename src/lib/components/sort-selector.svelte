<script lang="ts">
  import {
    ChevronDown,
    ArrowDown01,
    ArrowDown10,
    CalendarPlus,
    CalendarMinus,
    ArrowDownWideNarrow,
    ArrowDownNarrowWide
  } from 'lucide-svelte'
  import { Button } from './ui/button'
  import { createEventDispatcher } from 'svelte'
  import { clickOutside } from 'svelte-use-click-outside'
  import { cn } from '$lib/utils'

  type Sort = {
    value: string
    label: string
    icon: any
  }

  const availableSorts = [
    { value: 'recently-acquired', label: 'Recently Acquired', icon: CalendarPlus },
    { value: 'oldest-acquired', label: 'Oldest Acquired', icon: CalendarMinus },
    { value: 'collection-asc', label: 'Lowest Collection', icon: ArrowDownNarrowWide },
    { value: 'collection-desc', label: 'Highest Collection', icon: ArrowDownWideNarrow },
    { value: 'serial-asc', label: 'Lowest Serial', icon: ArrowDown01 },
    { value: 'serial-desc', label: 'Highest Serial', icon: ArrowDown10 }
  ]

  const dispatch = createEventDispatcher()

  let open = false
  let selected = availableSorts[0]

  function select(sort: Sort) {
    selected = sort
    open = false
    dispatch('change', selected.value)
  }
</script>

<div class="relative" use:clickOutside={() => (open = false)}>
  <Button
    on:click={() => (open = !open)}
    class="w-52 flex justify-between gap-2 text-base border-2 border-accent"
    variant="ghost"
  >
    <span>{selected.label}</span>
    <ChevronDown class="w-4 h-4" />
  </Button>

  {#if open}
    <div
      class="absolute w-52 z-50 flex flex-col bg-background rounded p-1 mt-[1px] text-accent-foreground text-sm border border-accent shadow animate-in slide-in-from-top-1"
    >
      {#each availableSorts as sort}
        <button
          class={cn(
            'w-full flex gap-4 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all',
            sort.value === selected.value && 'bg-accent rounded'
          )}
          on:click={() => select(sort)}
        >
          <svelte:component this={sort.icon} class="w-5 h-5" />
          {sort.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
