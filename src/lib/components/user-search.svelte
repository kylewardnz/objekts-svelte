<script lang="ts">
  import { Loader2 } from 'lucide-svelte'
  import { goto } from '$app/navigation'
  import type { User } from '$lib/types'
  import { cn } from '$lib/utils'

  let loading = false
  let routing = false
  let users: User[] = []
  let dirty = false
  let timer: number

  const debounce = (value: string) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      search(value)
    }, 750)
  }

  function view(user: string) {
    routing = true // because svelte has no concept of a +loading component...
    goto(`/${user}`)
  }

  async function search(input: string) {
    if (input.length < 3) {
      return
    }

    loading = true

    // show dropdown
    dirty = true

    // fetch users
    const res = await fetch(`/api/search/${input}`)
    if (res.ok) {
      users = await res.json()
    } else {
      users = []
    }

    loading = false
  }

  function selectFirst() {
    if (users.length > 0) {
      view(users[0].nickname)
    }
  }
</script>

<div class="relative">
  <!-- input -->
  <div class="flex flex-col gap-2 text-center">
    <label for="user">Search Cosmo for a user</label>
    <div
      class="flex gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-md border border-transparent shadow focus-within:border-blue-500 transition"
    >
      <input
        on:keyup={(e) => debounce(e.currentTarget.value)}
        on:keydown={(e) => e.key === 'Enter' && selectFirst()}
        disabled={routing}
        spellcheck="false"
        autocomplete="off"
        name="user"
        type="text"
        placeholder="Search..."
        class="w-full bg-transparent focus:outline-none"
      />

      {#if loading || routing}
        <Loader2 class="w-6 h-6 animate-spin" />
      {/if}
    </div>
  </div>

  <!-- dropdown -->
  {#if dirty && search.length > 0 && !loading}
    <div
      class="absolute flex flex-col w-full bg-slate-200 dark:bg-slate-800 rounded-md p-1 mt-1 text-lg text-accent-foreground shadow animate-in slide-in-from-top-1"
    >
      {#if users.length === 0}
        <p class="py-1 px-2 text-center">No results found</p>
      {:else}
        {#each users as { nickname, address, profileImageUrl }}
          <button
            disabled={loading}
            on:click={() => view(nickname)}
            class="grid grid-cols-3 items-center py-1 px-2 hover:bg-muted hover:rounded transition-all"
          >
            <img
              class={cn('rounded-full w-8 h-8', profileImageUrl == '' && 'bg-accent p-1')}
              src={profileImageUrl || '/profile.webp'}
              alt={nickname}
            />
            <span class="justify-start">{nickname}</span>
            <span class="justify-self-end text-xs">{address.slice(0, 8)}</span>
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>
