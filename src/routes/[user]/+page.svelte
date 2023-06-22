<script lang="ts">
  import type { PageData } from './$types'
  import type { Objekt } from '$lib/types'
  import ObjektList from '$components/objekt-list.svelte'
  import { onMount } from 'svelte'

  export let data: PageData

  let objekts: Objekt[] = []
  let loading = true

  async function fetchObjekts(pageKey?: string) {
    const res = await fetch(`/api/objekts/${data.address}${pageKey ? `?pageKey=${pageKey}` : ''}`)
    const result = await res.json()

    objekts.push(...result.objekts)
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
    <div class="flex flex-col gap-4 justify-center items-center py-12">
      <span class="loader" />
      <p class="text-lg">Fetching objekts!</p>
    </div>
  {:else}
    <ObjektList {objekts} address={data.address} />
  {/if}
</div>

<style scoped>
  .loader {
    width: 6rem;
    height: 6rem;
    border: 12px solid hsl(var(--foreground));
    border-bottom-color: #3b82f6;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1.5s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
