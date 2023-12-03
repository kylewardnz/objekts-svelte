<script lang="ts">
  export let name: string
  export let address: string

  const handle = address.startsWith(name) ? address : name
</script>

<a
  href={`https://apollo.cafe/@${handle}`}
  class="flex items-center gap-2 rounded-md border-2 border-accent px-3 py-1 font-bold hover:bg-accent transition-colors"
>
  <img src="apollo.png" alt="Apollo" class="h-8 aspect-auto invert dark:invert-0" />
  <span class="whitespace-nowrap">View on Apollo</span>
</a>
