<script lang="ts">
  import memberList from '../../members.json'
  import type { Objekt as RemoteObjekt } from '$lib/types'
  import { selected } from '$lib/store'
  import MemberFilter from './member-filter.svelte'
  import Objekt from './objekt.svelte'
  import CopyButton from './copy-button.svelte'

  export let objekts: RemoteObjekt[] = []
  export let address: string

  let filter: string = 'all'
  let sort: string = 'newest'

  $: filteredObjekts = filterObjekts(sortObjekts(filterMembers(objekts, $selected), sort), filter)

  function filterObjekts(input: RemoteObjekt[], f: string) {
    switch (f) {
      case 'digital':
        return input.filter((objekt) => objekt.collection.includes('Z'))
      case 'physical':
        return input.filter((objekt) => objekt.collection.includes('A'))
      default:
        return input
    }
  }

  function sortObjekts(input: RemoteObjekt[], s: string) {
    switch (s) {
      case 'newest':
        return input.slice().sort((a, b) => b.tokenId - a.tokenId)
      case 'oldest':
        return input.slice().sort((a, b) => a.tokenId - b.tokenId)
      default:
        return input
    }
  }

  function filterMembers(input: RemoteObjekt[], members: string[]) {
    if (members.length === 0) return input

    return input.filter((objekt) => {
      const existsS = members.includes('tripleS')
      const existsA = members.includes('ARTMS')
      const filtered = []

      if (existsS) {
        const S = memberList.slice(4)
        filtered.push(...S.map((x) => x.name))
      }

      if (existsA) {
        const A = memberList.slice(0, 4)
        filtered.push(...A.map((x) => x.name))
      }

      if (!existsS && !existsA) {
        filtered.push(...members)
      }

      return filtered.includes(objekt.memberName)
    })
  }
</script>

<!-- copy button, count, sorting -->
<div class="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-2 items-center">
  <div class="flex justify-center lg:justify-start">
    <CopyButton {address} />
  </div>

  <div class="flex justify-center font-bold">{objekts.length} Objekts</div>

  <!-- sort and filter -->
  <div class="flex flex-row justify-center gap-2 lg:justify-end col-span-2 lg:col-span-1">
    <!-- sort -->
    <select
      class="w-[180px] p-2 rounded-md bg-accent focus:outline-none"
      bind:value={sort}
      on:change={(e) => (sort = e.currentTarget.value)}
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>

    <!-- filter -->
    <select
      class="w-[180px] p-2 rounded-md bg-accent focus:outline-none"
      bind:value={filter}
      on:change={(e) => (filter = e.currentTarget.value)}
    >
      <option value="all">All</option>
      <option value="digital">Digital</option>
      <option value="physical">Physical</option>
    </select>
  </div>
</div>

<!-- filter by member -->
<MemberFilter />

<!-- list -->
<div class="grid grid-cols-2 items-center gap-2 lg:grid-cols-4">
  {#key filteredObjekts}
    {#each filteredObjekts as objekt}
      <Objekt {...objekt} />
    {:else}
      <p class="text-center w-full col-span-4">0 objekts found</p>
    {/each}
  {/key}
</div>
