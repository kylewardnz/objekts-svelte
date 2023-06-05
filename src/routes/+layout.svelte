<script lang="ts">
  import "../app.postcss";
  import "@fontsource/inter";
  import Theme from "$components/theme.svelte";
	import About from "$components/about.svelte";
</script>

<svelte:head>
  <meta name="description" content="View your tripleS and ARTMS objekt collection.">
</svelte:head>

<div class="h-screen container flex flex-col mx-auto gap-6 p-5">
  <!-- nav -->
  <div class="grid grid-cols-3 items-center">
    <div class="flex justify-start">
      <Theme />
    </div>
    <a href="/" class="mx-auto w-fit text-center text-lg underline underline-offset-8 decoration-blue-500">objekts</a>
    <div class="flex justify-end">
      <About />
    </div>
  </div>

  <!-- content -->
  <slot />
</div>