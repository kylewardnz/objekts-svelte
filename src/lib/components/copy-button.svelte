<script lang="ts">
  import { page } from '$app/stores'
  import { Hash, Link, Share2 } from 'lucide-svelte'
  import { Button } from './ui/button'
  import { copy } from 'svelte-copy'

  export let address: string

  let open = false

  const actions = [
    {
      icon: Link,
      label: 'Link',
      action: () => (open = false),
      text: $page.url.href
    },
    {
      icon: Hash,
      label: 'Address',
      action: () => (open = false),
      text: address
    }
  ]
</script>

<div class="relative">
  <Button
    on:click={() => (open = !open)}
    class="flex flex-row gap-2 w-fit text-base"
    variant="ghost"
  >
    <Share2 class="w-4 h-4" /> Share
  </Button>

  {#if open}
    <div
      class="absolute flex flex-col bg-background rounded p-1 mt-[1px] text-accent-foreground text-sm border border-accent shadow animate-in slide-in-from-top-1"
    >
      {#each actions as { icon, label, action, text }}
        <button
          class="flex flex-row gap-2 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all"
          on:svelte-copy={action}
          use:copy={text}
        >
          <svelte:component this={icon} class="h-4 w-4" />
          {label}
        </button>
      {/each}
    </div>
  {/if}
</div>
