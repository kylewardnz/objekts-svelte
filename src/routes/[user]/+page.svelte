<script lang="ts">
  import type { PageData } from './$types'
  import type { Objekt, ObjektPage } from '$lib/types'
  import ObjektList from '$components/objekt-list.svelte'
  import { onMount } from 'svelte'
  import { cn } from '$lib/utils'

  export let data: PageData

  let totalCount = 0
  let objekts: Objekt[] = []
  let loading = true

  $: percentage = Math.round((objekts.length / totalCount) * 100) || 0

  async function fetchObjekts(pageKey?: string) {
    const res = await fetch(`/api/objekts/${data.address}${pageKey ? `?pageKey=${pageKey}` : ''}`)
    const result = (await res.json()) as ObjektPage

    totalCount = result.totalCount
    objekts = [...objekts, ...result.objekts]

    if (result.pageKey) {
      await fetchObjekts(result.pageKey)
    } else {
      loading = false
    }
  }

  onMount(async () => {
    await fetchObjekts()
  })
</script>

<svelte:head>
  <title>{data.name}'s objekts</title>
</svelte:head>

<div class="w-full flex flex-col gap-6">
  {#if loading}
    <div class="flex flex-col gap-1 justify-center items-center py-48">
      <div class="w-3/4 md:w-1/3 bg-accent dark:bg-foreground h-1 shadow-sm rounded">
        <div
          class={cn('bg-blue-500 h-1 rounded transition-all duration-300')}
          style:width={`${percentage}%`}
        />
      </div>
      <p class="text-lg">Fetching objekts!</p>
      {#if totalCount}
        <p class="text-xs">{objekts.length} / {totalCount}</p>
      {/if}
    </div>
  {:else}
    <ObjektList {objekts} address={data.address} />
  {/if}
</div>
