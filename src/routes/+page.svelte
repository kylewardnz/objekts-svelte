<script lang="ts">
  import { Separator } from '$components/ui/separator'
  import UserFind from '$components/user-find.svelte'
  import UserSearch from '$components/user-search.svelte'
</script>

<svelte:head>
  <title>objekts</title>
</svelte:head>

<div class="w-full lg:w-1/3 flex flex-col items-center mx-auto pt-6 gap-2 text-sm text-center">
  <a href="https://apollo.cafe">
    <img src="apollo.png" alt="Apollo" class="h-16 aspect-auto invert dark:invert-0" />
  </a>
  <p class="font-semibold">objekts.jinsoul.tv will soon be replaced by Apollo</p>
  <p>
    The data source this site uses has become unreliable and all progress has been put into Apollo
  </p>
  <p>
    Apollo is an unofficial desktop version of Cosmo, including the ability to send objekts,
    complete grids and view full gravity details
  </p>
  <p>
    It also includes new features such as locking objekts, sharable wishlists and a COMO drop
    calendar
  </p>
  <a href="https://apollo.cafe" class="underline">apollo.cafe</a>
</div>

<Separator />

<div class="w-full lg:w-1/3 m-auto">
  <UserSearch />
</div>

<Separator />

<div class="w-full flex justify-center m-auto">
  <UserFind />
</div>
