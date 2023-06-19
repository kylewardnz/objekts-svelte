<script lang="ts">
  import members from '../../members.json'
  import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar'
  import { Separator } from '$components/ui/separator'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$components/ui/tooltip'
  import { cn } from '$lib/utils'
  import { selected } from '$lib/store'

  $: groupSelected = $selected.includes('SSS') || $selected.includes('ARTMS')

  function select(name: string) {
    // unselect groups when selecting a member
    if (['SSS', 'ARTMS'].includes(name) === false && groupSelected) {
      selected.update((state) => state.filter((n) => !['SSS', 'ARTMS'].includes(n)))
    }

    // unselect members when selecting a group
    if (['SSS', 'ARTMS'].includes(name) && !groupSelected) {
      selected.set([name])
      return
    }

    // select a member
    if ($selected.includes(name)) {
      selected.update((state) => state.filter((n) => n !== name))
    } else {
      selected.update((state) => [...state, name])
    }

    // select both groups when no members are selected
    if ($selected.length === 0) {
      selected.set(['SSS', 'ARTMS'])
    }
  }
</script>

<div
  class="flex flex-row gap-3 lg:justify-center items-center justify-start shrink-0 p-2 overflow-x-auto"
>
  <TooltipProvider>
    <!-- ARTMS -->
    <Tooltip>
      <TooltipTrigger>
        <button on:click={() => select('ARTMS')}>
          <Avatar
            class={cn(
              'shadow-md transition-all',
              $selected.includes('ARTMS') && 'ring ring-blue-500'
            )}
          >
            <AvatarFallback>A</AvatarFallback>
            <AvatarImage src="/members/ARTMS.png" alt="ARTMS" />
          </Avatar>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>ARTMS</p>
      </TooltipContent>
    </Tooltip>

    <!-- tripleS -->
    <Tooltip>
      <TooltipTrigger>
        <button on:click={() => select('SSS')}>
          <Avatar
            class={cn(
              'shadow-md transition-all',
              $selected.includes('SSS') && 'ring ring-blue-500'
            )}
          >
            <AvatarFallback>S</AvatarFallback>
            <AvatarImage src="/members/tripleS.png" alt="tripleS" />
          </Avatar>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>tripleS</p>
      </TooltipContent>
    </Tooltip>

    <Separator orientation="vertical" />

    <!-- all members -->
    {#each members as { placeholder, filterValue, label, image, show, color }}
      {#if show}
        <Tooltip>
          <TooltipTrigger>
            <button on:click={() => select(filterValue)}>
              <Avatar
                class={cn(
                  'shadow-md transition-all',
                  $selected.includes(filterValue) && `ring ring-${color ?? 'blue-500'}`
                )}
              >
                <AvatarFallback>{placeholder}</AvatarFallback>
                <AvatarImage src={image} alt={label ?? filterValue} />
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label ?? filterValue}</p>
          </TooltipContent>
        </Tooltip>
      {/if}
    {/each}
  </TooltipProvider>
</div>
