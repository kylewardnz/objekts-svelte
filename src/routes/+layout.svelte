<script lang="ts">
  import '../app.postcss'
  import '@fontsource/inter'
  import Theme from '$components/theme.svelte'
  import About from '$components/about.svelte'
  import { PUBLIC_UMAMI_ANALYTICS } from '$env/static/public'
  import { TooltipProvider } from '$components/ui/tooltip'
  import { page } from '$app/stores'
  import { cn } from '$lib/utils'

  $: isIndex = $page.url.pathname === '/'
</script>

<svelte:head>
  <meta name="description" content="View your tripleS and ARTMS objekt collection." />

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
  <div class="grid grid-cols-3 items-center h-8">
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
    <div class="flex justify-end">
      <About />
    </div>
  </div>

  <!-- content -->
  <TooltipProvider>
    <slot />
  </TooltipProvider>
</div>
