<script lang="ts">
  import type { PageData } from './$types'
  import ObjektList from '$components/objekt-list.svelte'

  export let data: PageData
</script>

<svelte:head>
  <title>{data.name}'s objekts</title>
</svelte:head>

<ObjektList objekts={data.objekts} address={data.address} />
