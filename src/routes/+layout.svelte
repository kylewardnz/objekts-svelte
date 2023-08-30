<script lang="ts">
  import '../app.postcss'
  import '@fontsource/inter'
  import Theme from '$components/layout/theme.svelte'
  import About from '$components/layout/about.svelte'
  import { PUBLIC_UMAMI_ANALYTICS } from '$env/static/public'
  import { page } from '$app/stores'
  import { cn } from '$lib/utils'
  import { LogIn, User } from 'lucide-svelte'
  import type { LayoutData } from './$types'
  import { onMount } from 'svelte'
  import { cosmoUser, isSignedIn } from '$lib/store'
  import ComoBalance from '$components/layout/como-balance.svelte'

  export let data: LayoutData

  $: isIndex = $page.url.pathname === '/'

  // set the cosmo user in the store
  onMount(() => {
    isSignedIn.set(data.signedIn)
    cosmoUser.set(data.cosmoUser)
  })
</script>

<svelte:head>
  <meta name="description" content="View your tripleS and ARTMS objekt collection." />
  <meta property="og:description" content="View your tripleS and ARTMS objekt collection." />
  <meta property="og:image" content="/og.png" />
  <meta property="og:site_name" content="Objekts" />
  <meta property="og:title" content="Objekts" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Objekts" />
  <meta name="twitter:description" content="View your tripleS and ARTMS objekt collection." />
  <meta name="twitter:image" content="/og.png" />

  {#if PUBLIC_UMAMI_ANALYTICS}
    <script
      async
      src="https://analytics.umami.is/script.js"
      data-website-id={PUBLIC_UMAMI_ANALYTICS}
    ></script>
  {/if}
</svelte:head>

<div class="h-[100dvh] container flex flex-col mx-auto gap-6 p-5">
  <!-- nav -->
  <div class="grid grid-cols-3 items-center h-8 min-h-[2rem]">
    <div class="flex justify-start">
      <Theme />
    </div>
    <a
      href="/"
      class={cn(
        'mx-auto w-fit text-center underline underline-offset-8 decoration-blue-500 transition-all',
        isIndex ? 'text-2xl' : 'text-lg'
      )}>objekts</a
    >
    <div class="flex gap-4 justify-end">
      {#if $isSignedIn}
        <ComoBalance />
        <a href="/me" class="flex gap-2 items-center hover:scale-105 transition">
          <User />
        </a>
      {:else}
        <a href="/me/signin" class="flex gap-2 items-center hover:scale-105 transition">
          <LogIn /> <span class="hidden md:block">Sign In</span>
        </a>
      {/if}

      <About />
    </div>
  </div>

  <!-- content -->
  <slot />
</div>
