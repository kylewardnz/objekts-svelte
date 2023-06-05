<script lang="ts">
  import members from '../../members.json'
  import { Avatar, AvatarFallback, AvatarImage } from "$components/ui/avatar"
  import { Separator } from "$components/ui/separator";
	import { cn } from '$lib/utils';
  import { selected } from '$lib/store'

  $: groupSelected = $selected.includes('tripleS') || $selected.includes('ARTMS')

  function select(name: string) {
    // unselect groups when selecting a member
    if (['tripleS', 'ARTMS'].includes(name) === false && groupSelected) {
      selected.update(state => state.filter(n => !['tripleS', 'ARTMS'].includes(n)))
    }

    // unselect members when selecting a group
    if (['tripleS', 'ARTMS'].includes(name) && !groupSelected) {
      selected.set([name])
      return
    }

    // select a member
    if ($selected.includes(name)) {
      selected.update(state => state.filter(n => n !== name))
    } else {
      selected.update(state => [...state, name])
    }

    // select both groups when no members are selected
    if ($selected.length === 0) {
      selected.set(['tripleS', 'ARTMS'])
    }
  }
</script>

<div class="flex flex-row gap-2 justify-center">
  <!-- ARTMS -->
  <button on:click={() => select('ARTMS')}>
    <Avatar class={cn('shadow transition-all', $selected.includes('ARTMS') && 'ring ring-blue-500')}>
      <AvatarFallback>A</AvatarFallback>
      <AvatarImage src="/members/ARTMS.png" alt="ARTMS" />
    </Avatar>
  </button>

  <!-- tripleS -->
  <button on:click={() => select('tripleS')}>
    <Avatar class={cn('shadow transition-all', $selected.includes('tripleS') && 'ring ring-blue-500')}>
      <AvatarFallback>S</AvatarFallback>
      <AvatarImage src="/members/tripleS.png" alt="tripleS" />
    </Avatar>
  </button>

  <Separator orientation="vertical" />

  <!-- all members -->
  {#each members as { placeholder, name, image, color }}
    <button on:click={() => select(name)}>
      <Avatar class={cn('shadow transition-all', $selected.includes(name) && `ring ring-${color ?? 'blue-500'}`)}>
        <AvatarFallback>{placeholder}</AvatarFallback>
        <AvatarImage src={image} alt={name} />
      </Avatar>
    </button>
  {/each}
</div>