<script lang="ts">
  import { cn } from '$lib/utils'
  import * as Tooltip from '$components/ui/tooltip'
  import { Lock, Clock } from 'lucide-svelte'

  export let frontImage: string
  export let backImage: string
  export let className: string
  export let memberName: string
  export let collection: string
  export let season: string
  export let num: number
  export let acquiredAt: number
  export let transferable: boolean

  let image = frontImage
  let loading = false

  const acquired = new Date(acquiredAt).toDateString()

  function toggleImage() {
    loading = true
    image = image === frontImage ? backImage : frontImage
  }
</script>

<div class="flex flex-col items-center gap-2 touch-manipulation">
  <img
    on:load={() => (loading = false)}
    on:click={toggleImage}
    on:keydown={toggleImage}
    loading="lazy"
    class={cn(
      'aspect-photocard rounded-lg md:rounded-2xl hover:cursor-pointer shadow-lg transition duration-300',
      loading && 'blur-sm'
    )}
    src={image}
    width={291}
    height={450}
    alt={`${memberName} ${collection} ${num}`}
  />
  <slot {memberName} {collection} {season} {acquired} {className} {num} {transferable}>
    <div class="flex flex-col text-xs md:text-lg w-full lg:px-4">
      <div class="flex justify-between items-center">
        <p class="font-bold">{memberName} {collection}</p>
        <!-- because tooltip doesn't work on mobile... -->
        <div class="hidden lg:block">
          <Tooltip.Root openDelay={100}>
            <Tooltip.Trigger>
              <Clock class="w-4 h-4 lg:w-6 lg:h-6" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Acquired: {acquired}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <p>{className} #{num}</p>
        {#if !transferable}
          <Tooltip.Root openDelay={100}>
            <Tooltip.Trigger>
              <Lock class="w-4 h-4 lg:w-6 lg:h-6" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>Not transferable</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </div>
    </div>
  </slot>
</div>
