<script lang="ts">
  import { Sparkle, Moon } from 'lucide-svelte'
  import { cn } from '$lib/utils'
  import * as Tooltip from '$components/ui/tooltip'
  import type { CosmoUser } from '$lib/server/cosmo'

  export let user: CosmoUser | undefined

  $: balances = (user?.artists ?? []).map((artist) => ({
    name: artist.title,
    como: artist.assetBalance.totalComo,
    icon: artist.name === 'artms' ? Moon : Sparkle,
    color: artist.name === 'artms' ? 'teal-400' : 'purple-300'
  }))
</script>

<div class="flex gap-2 items-center">
  {#each balances as { name, como, icon, color } (name)}
    <Tooltip.Root openDelay={100}>
      <Tooltip.Trigger>
        <div
          class="flex justify-between items-center rounded bg-accent border border-black/30 dark:border-white/30 h-6 w-16 px-1 shadow"
        >
          <!-- icon -->
          <svelte:component
            this={icon}
            class={cn(
              `text-${color}`,
              `fill-${color}`,
              `ring-${color}`,
              'ring-1 p-px w-3 h-3 rounded-full'
            )}
          />

          <!-- balance -->
          <span class="text-sm">{como}</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>{name} COMO</p>
      </Tooltip.Content>
    </Tooltip.Root>
  {/each}
</div>
