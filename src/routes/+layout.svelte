<script lang="ts">
  import '../app.postcss'
  import '@fontsource/inter'
  import Theme from '$components/theme.svelte'
  import About from '$components/about.svelte'
  import { PUBLIC_CLOUDFLARE_ANALYTICS } from '$env/static/public'

  const token = `{ "token": "${PUBLIC_CLOUDFLARE_ANALYTICS}" }`
</script>

<svelte:head>
  <meta name="description" content="View your tripleS and ARTMS objekt collection." />

  {#if PUBLIC_CLOUDFLARE_ANALYTICS}
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={token}
    ></script>
  {/if}
</svelte:head>

<div class="h-screen container flex flex-col mx-auto gap-6 p-5">
  <!-- nav -->
  <div class="grid grid-cols-3 items-center">
    <div class="flex justify-start">
      <Theme />
    </div>
    <a
      href="/"
      class="mx-auto w-fit text-center text-lg underline underline-offset-8 decoration-blue-500"
      >objekts</a
    >
    <div class="flex justify-end">
      <About />
    </div>
  </div>

  <!-- content -->
  <slot />
</div>
