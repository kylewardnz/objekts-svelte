<script lang="ts">
  import { cn } from '$lib/utils'
  import { Tooltip, TooltipContent, TooltipTrigger } from '$components/ui/tooltip'
  import { Lock, Clock } from 'lucide-svelte'

  export let frontImage: string
  export let backImage: string
  export let className: string
  export let memberName: string
  export let season: string
  export let collection: string
  export let num: number
  export let tokenId: number
  export let type: string
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

<div class="flex flex-col items-center gap-2">
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
    width={300}
    height={480}
    alt={`${memberName} ${collection} ${num}`}
  />
  <div class="flex flex-col text-xs md:text-lg w-full lg:px-4">
    <div class="flex flex-row justify-between items-center">
      <p class="font-bold">{memberName} {collection}</p>
      <Tooltip>
        <TooltipTrigger>
          <Clock class="w-4 h-4 lg:w-6 lg:h-6" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Acquired: {acquired}</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <div class="flex flex-row justify-between items-center">
      <p>{className} #{num}</p>
      {#if !transferable}
        <Tooltip>
          <TooltipTrigger>
            <Lock class="w-4 h-4 lg:w-6 lg:h-6" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Not transferable</p>
          </TooltipContent>
        </Tooltip>
      {/if}
    </div>
  </div>
</div>
