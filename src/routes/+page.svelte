<script lang="ts">
  import { Separator } from '$components/ui/separator'
  import UserFind from '$components/user-find.svelte'
  import UserSearch from '$components/user-search.svelte'
</script>

<svelte:head>
  <title>objekts</title>
</svelte:head>

<div class="w-full lg:w-1/3 m-auto">
  <UserSearch />
</div>

<Separator />

<div class="w-full flex justify-center m-auto">
  <UserFind />
</div>
