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
    on:load={() => (loading = false)}
    on:click={toggleImage}
    on:keydown={toggleImage}
    loading="lazy"
    class={`aspect-photocard rounded-2xl hover:cursor-pointer hover:shadow-lg hover:scale-105 transition duration-300 ${
      loading ? 'blur-sm' : ''
    }`}
    src={image}
    width={300}
    height={480}
    alt={`${memberName} ${collection} ${num}`}
  />
  <div class="grid grid-cols-2 lg:grid-cols-3 grid-rows-2 lg:grid-rows-1 text-sm lg:text-base">
    <p class="font-bold col-span-2 lg:col-span-1">{memberName} {collection}</p>
    <p class="flex font-semibold lg:justify-end">{className}</p>
    <p class="flex justify-self-end">#{num}</p>
  </div>
</div>
