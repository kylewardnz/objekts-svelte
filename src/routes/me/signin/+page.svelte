<script lang="ts">
  import Button from '$components/ui/button/button.svelte'
  import { Label } from '$lib/components/ui/label'
  import { Input } from '$lib/components/ui/input'
  import { v4 } from 'uuid'
  import { applyAction, enhance } from '$app/forms'
  import type { ActionData } from './$types'

  export let form: ActionData

  // update the pending token upon form submission
  $: {
    if (form?.pendingToken) {
      pendingToken = form.pendingToken
    }
  }

  const transactionId = v4()
  let pendingToken = ''
  let email = ''
  let loading = false
</script>

<div class="w-full lg:w-1/2 my-48 mx-auto flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <h2 class="font-bold text-2xl">Sign In with Cosmo</h2>
    <h3 class="text-primary">Signing in allows you to customize your public profile.</h3>
  </div>

  {#if pendingToken}
    <!-- code exchange form -->
    <form
      method="POST"
      class="flex flex-col gap-4"
      action="?/exchangeCode"
      use:enhance={() => {
        loading = true
        return async ({ update, result }) => {
          loading = false
          update()
          await applyAction(result)
        }
      }}
    >
      <!-- internal fields -->
      <input type="hidden" name="transactionId" value={transactionId} />
      <input type="hidden" name="pendingToken" value={pendingToken} />
      <input type="hidden" name="email" value={email} />

      <p>
        Check your email for a sign-in link from Cosmo, return to this page once you have verified
        your sign-in.
      </p>
      <p>
        Make sure to click <span class="font-bold">confirm from a different device</span> or else sign-in
        won't work!
      </p>

      <Button type="submit" bind:disabled={loading}>Sign In</Button>
    </form>
  {:else}
    <!-- email capture form -->
    <form
      method="POST"
      class="flex flex-col gap-2"
      action="?/sendEmail"
      use:enhance={() => {
        loading = true
        return async ({ update }) => {
          loading = false
          update()
        }
      }}
    >
      <!-- internal fields -->
      <input type="hidden" name="transactionId" value={transactionId} />
      <input type="hidden" name="pendingToken" value={pendingToken} />

      <div class="flex flex-col gap-1">
        <Label for="email">Cosmo Email Address</Label>
        <Input name="email" id="email" type="email" bind:value={email} />
        {#if form?.invalid}
          <p class="text-red-500">Invalid email address</p>
        {/if}
      </div>

      <Button type="submit" bind:disabled={loading}>Send Email</Button>
    </form>
  {/if}
</div>
