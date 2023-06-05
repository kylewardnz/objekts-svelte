<script lang="ts">
  import { Loader2 } from 'lucide-svelte'
  import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';

  let user: string
  let loading = false

  function view() {
    loading = true
    goto(`/${user}`)
  }
</script>

<svelte:head>
  <title>objekts</title>
</svelte:head>

<div class="flex flex-col gap-2 text-center mx-auto lg:m-auto w-fit">
  <label for="user">Enter your Cosmo username or Polygon address</label>
  <div class="flex gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-md border border-transparent focus-within:border-blue-500 transition">
    <input
      bind:value={user}
      on:keydown={e => e.key === 'Enter' && view()}
      disabled={loading}
      spellcheck="false"
      name="user"
      type="text"
      placeholder="0x..."
      class="w-full bg-transparent focus:outline-none" />

    {#if loading}
    <Loader2 class="w-6 h-6 animate-spin" />
    {/if}
  </div>

  <Button class="text-base" disabled={user === undefined || user === '' || loading} on:click={view}>
    View Collection
  </Button>
</div>