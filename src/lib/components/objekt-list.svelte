<script lang="ts">
  import memberList from '../../members.json'
  import type { Objekt as RemoteObjekt, Filter } from '$lib/types'
  import { selected } from '$lib/store'
  import MemberFilter from '$lib/components/member-filter.svelte'
  import Objekt from '$lib/components/objekt.svelte'
  import CopyButton from '$lib/components/copy-button.svelte'
  import ListFilter from '$lib/components/list-filter.svelte'

  export let objekts: RemoteObjekt[] = []
  export let address: string

  const ARTMS_START = 4

  let sort: string = 'recently-acquired'
  let selectedFilters: Filter[] = []

  const colNum = (c: string) => parseInt(c.substring(0, c.length - 1))

  $: filteredObjekts = filterAll(objekts, selectedFilters, sort, $selected)

  function filterAll(input: RemoteObjekt[], filter: Filter[], sort: string, memberList: string[]) {
    return filterProperties(sortObjekts(filterMembers(input, memberList), sort), filter)
  }

  function sortObjekts(input: RemoteObjekt[], s: string) {
    switch (s) {
      case 'recently-acquired':
        return input.slice().sort((a, b) => b.acquiredAt - a.acquiredAt)
      case 'oldest-acquired':
        return input.slice().sort((a, b) => a.acquiredAt - b.acquiredAt)
      case 'collection':
        return input.slice().sort((a, b) => colNum(a.collection) - colNum(b.collection))
      default:
        return input
    }
  }

  function filterMembers(input: RemoteObjekt[], members: string[]) {
    if (members.length === 0) return input

    return input.filter((objekt) => {
      const existsS = members.includes('SSS')
      const existsA = members.includes('ARTMS')
      const filtered = []

      if (existsS) {
        const S = memberList.slice(ARTMS_START)
        filtered.push(...S.map((x) => x.filterValue))
      }

      if (existsA) {
        const A = memberList.slice(0, ARTMS_START)
        filtered.push(...A.map((x) => x.filterValue))
      }

      if (!existsS && !existsA) {
        filtered.push(...members)
      }

      return filtered.includes(objekt.memberName)
    })
  }

  function filterProperties(input: RemoteObjekt[], selectedFilters: Filter[]) {
    return input.filter((objekt) => {
      // show all by default
      if (selectedFilters.length === 0) {
        return true
      }

      const matches = []
      for (const filter of selectedFilters) {
        matches.push(objekt[filter.property] === filter.value)
      }
      return matches.some((x) => x === true)
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
      <option value="recently-acquired">Recently Acquired</option>
      <option value="oldest-acquired">Oldest Acquired</option>
      <option value="collection">Collection No.</option>
    </select>

    <!-- filter -->
    <ListFilter {objekts} on:filter={(e) => (selectedFilters = e.detail)} />
  </div>
</div>

<!-- filter by member -->
<MemberFilter />

<!-- list -->
<div class="grid grid-cols-3 items-center gap-2 lg:grid-cols-4 gap-y-8 pb-12">
  {#key filteredObjekts}
    {#each filteredObjekts as objekt}
      <Objekt {...objekt} />
    {:else}
      <p class="text-center w-full col-span-4">0 objekts found</p>
    {/each}
  {/key}
</div>
