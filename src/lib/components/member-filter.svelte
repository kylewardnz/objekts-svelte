<script lang="ts">
  import members from '../../members.json'
  import * as Avatar from '$components/ui/avatar'
  import { Separator } from '$components/ui/separator'
  import * as Tooltip from '$components/ui/tooltip'
  import { cn } from '$lib/utils'
  import { selected } from '$lib/store'
  import { navigating } from '$app/stores'

  // reset selected members when navigating
  $: {
    if ($navigating) {
      $selected = ['SSS', 'ARTMS']
    }
  }

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
  class="flex flex-row gap-3 lg:justify-center items-center justify-start shrink-0 p-2 overflow-x-auto touch-manipulation"
>
  <!-- ARTMS -->
  <Tooltip.Root openDelay={100}>
    <Tooltip.Trigger>
      <button on:click={() => select('ARTMS')}>
        <Avatar.Root
          class={cn(
            'shadow-md transition-all',
            $selected.includes('ARTMS') && 'ring ring-blue-500'
          )}
        >
          <Avatar.Fallback>A</Avatar.Fallback>
          <Avatar.Image src="/members/ARTMS.webp" alt="ARTMS" />
        </Avatar.Root>
      </button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>ARTMS</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <!-- tripleS -->
  <Tooltip.Root openDelay={100}>
    <Tooltip.Trigger>
      <button on:click={() => select('SSS')}>
        <Avatar.Root
          class={cn('shadow-md transition-all', $selected.includes('SSS') && 'ring ring-blue-500')}
        >
          <Avatar.Fallback>S</Avatar.Fallback>
          <Avatar.Image src="/members/tripleS.webp" alt="tripleS" />
        </Avatar.Root>
      </button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>tripleS</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <Separator orientation="vertical" />

  <!-- all members -->
  {#each members as { placeholder, filterValue, label, image, show, color }}
    {#if show}
      <Tooltip.Root openDelay={100}>
        <Tooltip.Trigger>
          <button on:click={() => select(filterValue)}>
            <Avatar.Root
              class={cn(
                'shadow-md transition-all',
                $selected.includes(filterValue) && `ring ring-${color ?? 'blue-500'}`
              )}
            >
              <Avatar.Fallback>{placeholder}</Avatar.Fallback>
              <Avatar.Image src={image} alt={label ?? filterValue} />
            </Avatar.Root>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{label ?? filterValue}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    {/if}
  {/each}
</div>
