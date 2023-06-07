<script lang="ts">
  import { goto } from '$app/navigation'
  import { Loader2 } from 'lucide-svelte'
  import { Button } from '$components/ui/button'

  let user: string
  let loading = false

  function view() {
    loading = true
    goto(`/${user}`)
  }
</script>

<div class="flex flex-col gap-2 text-center w-fit">
  <label for="user">Or enter a username/address if you already know it</label>
  <div
    class="flex gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-md border border-transparent shadow focus-within:border-blue-500 transition"
  >
    <input
      bind:value={user}
      on:keydown={(e) => e.key === 'Enter' && view()}
      disabled={loading}
      spellcheck="false"
      autocomplete="off"
      name="user"
      type="text"
      placeholder="0x..."
      class="w-full bg-transparent focus:outline-none"
    />

    {#if loading}
      <Loader2 class="w-6 h-6 animate-spin" />
    {/if}
  </div>

  <Button
    class="text-base shadow"
    disabled={user === undefined || user === '' || loading}
    on:click={view}
  >
    View Collection
  </Button>
</div>
