<script lang="ts">
  import Objekt from '../../components/objekt.svelte';
  import type { Objekt as RemoteObjekt } from '$lib/server/nft'
  import type { PageData } from './$types';

  export let data: PageData;

  let filter: string = 'all';
  let sort: string = 'newest';

  $: objekts = executeFilters(data.objekts, filter, sort);

  function executeFilters(input: RemoteObjekt[], f: string, s: string) {
    const sorted = sortObjekts(input, s);
    return filterObjekts(sorted, f);
  }

  function filterObjekts(input: RemoteObjekt[], f: string) {
    switch (f) {
      case 'digital':
        return input.filter(objekt => objekt.collection.includes('Z'))
      case 'physical':
        return input.filter(objekt => objekt.collection.includes('A'))
      default:
        return input;
    }
  }

  function sortObjekts(input: RemoteObjekt[], s: string) {
    switch (s) {
      case 'newest':
        return input.slice().sort((a, b) => b.tokenId - a.tokenId);
      case 'oldest':
        return input.slice().sort((a, b) => a.tokenId - b.tokenId);
      default:
        return input;
    }
  }
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>


<div class="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
  <div class="text-center font-bold lg:text-left">{data.objekts.length} Objekts</div>

  <!-- sort and filter -->
  <div class="flex flex-row justify-center gap-2 lg:justify-end">
    <!-- sort -->
    <select class="w-[180px] p-2 rounded-md bg-slate-800 focus:outline-none" bind:value={sort} on:change={e => sort = e.currentTarget.value}>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>

    <!-- filter -->
    <select class="w-[180px] p-2 rounded-md bg-slate-800 focus:outline-none" bind:value={filter} on:change={e => filter = e.currentTarget.value}>
      <option value="all">All</option>
      <option value="digital">Digital</option>
      <option value="physical">Physical</option>
    </select>
  </div>
</div>
<div class="grid grid-cols-2 items-center gap-2 lg:grid-cols-4">
  {#key objekts}
  {#each objekts as objekt}
  <Objekt {...objekt} />
  {:else}
	<p class="text-center w-full col-span-4">nothing!</p>
  {/each}
  {/key}
</div>