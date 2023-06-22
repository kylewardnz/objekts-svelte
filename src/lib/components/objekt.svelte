<script lang="ts">
  export let frontImage: string
  export let backImage: string
  export let className: string
  export let memberName: string
  export let season: string
  export let collection: string
  export let num: number
  export let tokenId: number
  export let type: string
  export let acquiredAt: number

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
  <div class="grid grid-cols-2 grid-rows-2 lg:grid-cols-3 text-xs md:text-base w-full lg:px-4">
    <p class="font-bold lg:justify-self-center">{memberName}</p>
    <p class="font-bold justify-self-end lg:justify-self-center">{collection}</p>
    <p class="font-semibold lg:justify-self-center">{className}</p>
    <p class="lg:col-span-3 justify-self-end lg:justify-self-center">#{num}</p>
  </div>
</div>
