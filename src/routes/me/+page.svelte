<script lang="ts">
  import { enhance } from '$app/forms'
  import Button from '$components/ui/button/button.svelte'
  import type { ActionData, PageData } from './$types'
  import { Switch } from '$lib/components/ui/switch'
  import { Label } from '$lib/components/ui/label'
  import { Loader2 } from 'lucide-svelte'

  export let data: PageData
  export let form: ActionData

  let loading = false
  let isPrivate = data.user.isPrivate
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="w-full lg:w-1/2 my-24 mx-auto flex flex-col gap-4">
  <h2 class="font-bold text-2xl">Settings</h2>

  <h4>These options have nothing to do with Cosmo, just this website.</h4>

  <form
    method="POST"
    action="?/updateAccount"
    class="flex flex-col gap-4"
    use:enhance={() => {
      loading = true
      return async ({ update }) => {
        await update()
        loading = false
      }
    }}
  >
    <div class="flex gap-2 items-center">
      <Switch id="isPrivate" bind:checked={isPrivate} />
      <input hidden name="isPrivate" value={isPrivate} />
      <Label for="isPrivate">Private account</Label>
    </div>

    <div class="flex gap-2 items-center">
      <Button type="submit" class="w-fit" disabled={loading}>
        {#if loading}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Save
      </Button>
      {#if form?.success}
        <span class="text-sm">Settings saved!</span>
      {/if}
    </div>
  </form>
</div>
