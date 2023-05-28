<script>
  import "../app.css";
  import "@fontsource/inter";
</script>

<style lang="postcss">
  :global(html) {
    font-family: 'Inter', sans-serif;
  }
</style>

<div class="bg-slate-950 h-screen text-slate-100">
  <slot />
</div>
