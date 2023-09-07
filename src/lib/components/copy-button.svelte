<script lang="ts">
  import { page } from '$app/stores'
  import { Hash, Link, Share2, ExternalLink } from 'lucide-svelte'
  import { Button } from './ui/button'
  import { copy } from 'svelte-copy'
  import { clickOutside } from 'svelte-use-click-outside'

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
    },
    {
      icon: ExternalLink,
      label: 'PolygonScan',
      action: () => {
        open = false
        window.open(`https://polygonscan.com/address/${address}`, '_blank')
      },
      text: `https://polygonscan.com/address/${address}`
    }
  ]
</script>

<div class="relative touch-manipulation" use:clickOutside={() => (open = false)}>
  <Button
    on:click={() => (open = !open)}
    class="flex flex-row gap-2 w-fit text-base border-2 border-accent"
    variant="ghost"
  >
    <Share2 class="w-4 h-4" /> Share
  </Button>

  {#if open}
    <div
      class="absolute z-50 flex flex-col bg-background rounded p-1 mt-[1px] text-accent-foreground text-sm border border-accent shadow animate-in slide-in-from-top-1"
    >
      {#each actions as { icon, label, action, text }}
        <button
          class="flex flex-row gap-4 items-center py-1 px-2 hover:bg-accent hover:rounded transition-all"
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
