<script lang="ts">
  import type { Objekt as RemoteObjekt, Filter } from '$lib/types'
  import { selected } from '$lib/store'
  import MemberFilter from '$lib/components/member-filter.svelte'
  import Objekt from '$lib/components/objekt.svelte'
  import CopyButton from '$lib/components/copy-button.svelte'
  import AttributeFilter from '$components/attribute-filter.svelte'
  import { Tooltip, TooltipContent, TooltipTrigger } from '$components/ui/tooltip'
  import InfiniteScroll from 'svelte-infinite-scroll'
  import SortSelector from './sort-selector.svelte'
  import { ChevronDown } from 'lucide-svelte'
  import { executeFilters } from '$lib/filtering'

  export let objekts: RemoteObjekt[] = []
  export let address: string

  const PAGE_SIZE = 24

  let sort = 'recently-acquired' as const
  let selectedFilters: Filter[] = []
  let page = 0
  let filterMode: 'and' | 'or' = 'and'

  // execute filters
  $: filteredObjekts = executeFilters({
    input: objekts,
    filters: selectedFilters,
    sort,
    members: $selected,
    filterMode
  })

  // execute pagination
  $: paginatedObjekts = filteredObjekts.slice().splice(0, PAGE_SIZE * (page + 1))

  // reset page when changing filters
  $: sort, selectedFilters, $selected, (page = 0)
</script>

<!-- copy button, count, sorting -->
<div class="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-2 items-center">
  <div class="flex justify-center lg:justify-start">
    <CopyButton {address} />
  </div>

  <div class="flex justify-center font-bold">
    <Tooltip>
      <TooltipTrigger>
        <div class="flex gap-2 items-center">
          <p>{filteredObjekts.length} Objekts</p>
          {#if filteredObjekts.length !== objekts.length}
            <p class="flex sm:hidden text-xs">({objekts.length} total)</p>
          {/if}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{objekts.length} total</p>
      </TooltipContent>
    </Tooltip>
  </div>

  <!-- sort and filter -->
  <div class="flex flex-row justify-center gap-2 lg:justify-end col-span-2 lg:col-span-1">
    <!-- sort -->
    <SortSelector bind:value={sort} />

    <!-- filter -->
    <AttributeFilter {objekts} bind:filters={selectedFilters} bind:mode={filterMode} />
  </div>
</div>

<!-- filter by member -->
<MemberFilter />

<!-- list -->
<div class="grid grid-cols-3 items-center gap-2 lg:grid-cols-4 gap-y-4 pb-12">
  {#each paginatedObjekts as objekt (objekt.key)}
    <Objekt {...objekt} />
  {:else}
    <p class="text-center w-full col-span-4">0 objekts found</p>
  {/each}

  <!-- load more indicator -->
  {#if paginatedObjekts.length !== filteredObjekts.length}
    <div class="flex justify-center col-span-3 lg:col-span-4 py-12">
      <ChevronDown class="w-16 h-16 animate-bounce" />
    </div>
  {/if}

  <InfiniteScroll threshold={24} on:loadMore={() => page++} window={true} />
</div>
