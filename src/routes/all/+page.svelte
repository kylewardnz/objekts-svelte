<script lang="ts">
  import type { PageData } from './$types'
  import Objekt from '$components/objekt.svelte'
  import type { Filter } from '$lib/types'
  import AttributeFilter from '$components/attribute-filter.svelte'
  import CollectionFilter from '$components/collection-filter.svelte'
  import { executeFilters } from '$lib/filtering'
  import { selected } from '$lib/store'
  import MemberFilter from '$components/member-filter.svelte'

  export let data: PageData

  // reset store
  $selected = []

  let sort = 'recently-acquired' as const
  let attributeFilters: Filter[] = []
  let collectionFilters: string[] = []
  let filterMode: 'and' | 'or' = 'and'

  // execute filters
  $: filteredObjekts = executeFilters({
    input: data.objekts,
    attributeFilters,
    collectionFilters,
    sort,
    members: $selected,
    filterMode,
    showAll: false
  })
</script>

<svelte:head>
  <title>All Objekts · objekts</title>
</svelte:head>

<div class="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-2 items-center">
  <p>Viewing all available objekts</p>

  <p class="flex justify-center font-bold touch-manipulation">
    {data.objekts.length} Objekts
  </p>
  <!-- sort and filter -->
  <div
    class="flex flex-row flex-wrap lg:flex-nowrap justify-center gap-2 lg:justify-end col-span-2 lg:col-span-1"
  >
    <!-- attribute filter -->
    <AttributeFilter
      objekts={data.objekts}
      bind:filters={attributeFilters}
      bind:mode={filterMode}
    />

    <!-- collection filter -->
    <CollectionFilter objekts={data.objekts} bind:filters={collectionFilters} />
  </div>
</div>

<!-- filter by member -->
<MemberFilter reset={false} />

<div class="grid grid-cols-4 lg:grid-cols-8 gap-2 gap-y-4 pb-12">
  {#each filteredObjekts as objekt (objekt.key)}
    <Objekt {...objekt} let:memberName let:collection let:season let:className>
      <div class="flex flex-col text-2xs sm:text-xs lg:text-xs xl:text-sm w-full">
        <div class="flex justify-center items-center">
          <p class="font-bold">{memberName} {collection}</p>
        </div>

        <div class="flex justify-center gap-0 flex-col md:flex-row md:gap-2 items-center">
          <p>{season}</p>
          <p>{className}</p>
        </div>
      </div>
    </Objekt>
  {:else}
    <p class="col-span-full text-center">
      {#if $selected.length === 0}
        Select a member to get started
      {:else}
        No objekts found
      {/if}
    </p>
  {/each}
</div>
