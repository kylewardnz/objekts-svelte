<script lang="ts">
  import { enhance } from '$app/forms'
  import Button from '$components/ui/button/button.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="w-full lg:w-1/2 my-48 mx-auto flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <!-- logout action -->
    <form method="POST" action="?/logout" use:enhance>
      <Button type="submit" variant="link">Sign Out</Button>
    </form>

    <h2 class="font-bold text-2xl">Signed in as: {data.cosmoUser?.nickname}</h2>
  </div>
</div>
