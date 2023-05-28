<script lang="ts">
  import "../app.css";
  import "@fontsource/inter";
</script>

<style lang="postcss">
  :global(html) {
    font-family: 'Inter', sans-serif;
    overflow-y: overlay;
    @apply bg-slate-950 text-slate-100 antialiased;
  }
</style>

<div class="h-screen container flex flex-col mx-auto gap-6 p-5">
  <a href="/" class="mx-auto w-fit text-center text-lg underline underline-offset-8 decoration-blue-500">objekts</a>

  <slot />
</div>
