<script lang="ts">
  export let frontImage: string
  export let backImage: string
  export let className: string
  export let memberName: string
  export let season: string
  export let collection: string
  export let num: number
  export let tokenId: number

  let image = frontImage
  let loading = false

  function toggleImage() {
    loading = true
    image = image === frontImage ? backImage : frontImage
  }
</script>

<div class="flex flex-col items-center gap-2">
  <img
    on:load={() => loading = false}
    on:click={toggleImage}
    on:keydown={toggleImage}
    loading="lazy"
    class={`aspect-photocard hover:cursor-pointer hover:shadow-lg hover:scale-105 transition duration-300 ${loading ? 'blur-sm' : ''}`}
    src={image}
    width={300}
    height={480}
    alt={`${memberName} ${collection} ${num}`} />
  <div class="grid grid-cols-1 grid-rows-3 lg:grid-cols-2 lg:grid-rows-2">
    <p class="font-bold">{memberName} {collection}</p>
    <p class="flex font-semibold lg:justify-end">{className}</p>
    <p>#{num} ({tokenId})</p>
  </div>
</div>