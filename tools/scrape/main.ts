import { Redis } from '@upstash/redis/nodejs'
import { getNFTsForContract } from './alchemy'
import { db } from './db'
import { objekts } from '../../src/lib/server/db/schema'

type Scrapable = {
  name: string
  contract: string
  cacheKey: string
}

const SCRAPABLE: Scrapable[] = [
  {
    name: 'ARTMS',
    contract: '0x0fB69F54bA90f17578a59823E09e5a1f8F3FA200',
    cacheKey: 'scrape:artms'
  }
  // {
  //   name: 'tripleS',
  //   contract: '0xA4B37bE40F7b231Ee9574c4b16b7DDb7EAcDC99B',
  //   cacheKey: 'scrape:triples'
  // }
]

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env
if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('No Upstash Redis REST URL or token provided')
}

const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })

for (const scrapable of SCRAPABLE) {
  start(scrapable)
}

type Objekt = Awaited<ReturnType<typeof getNFTsForContract>>['nfts'][number]['raw']['metadata']
async function start({ name, contract, cacheKey }: Scrapable) {
  console.log(`Starting scrape for ${name}`)

  const existing = await db.select().from(objekts)

  const fetchObjekts = async (page: string | null) => {
    console.log(`Scraping ${name}`)

    // fetch nfts
    const response = await getNFTsForContract(contract, page ?? undefined)
    // insert into db
    const filteredNfts = response.nfts
      // filter out deleted objekts
      .filter((nft) => nft.raw.metadata.objekt !== undefined)
      // filter out existing objekts
      .filter(
        (nft) =>
          existing.find(
            (existingNft) => existingNft.frontImage === nft.raw.metadata.objekt.frontImage
          ) === undefined
      )
      .map((nft) => mapCommonObjektFields(nft.raw.metadata))
    if (filteredNfts.length) {
      await db.insert(objekts).ignore().values(filteredNfts)
    }
    // save page in case of crashes
    await redis.set(cacheKey, response.pageKey)
    // loop
    await fetchObjekts(response.pageKey)
  }

  const pageKey = await redis.get<string | null>(cacheKey)
  await fetchObjekts(pageKey)
}

const collectionMap: Record<string, 'physical' | 'digital'> = {
  A: 'physical',
  Z: 'digital'
}
function mapCommonObjektFields(metadata: Objekt) {
  return {
    frontImage: metadata?.objekt.frontImage as string,
    backImage: metadata?.objekt.backImage as string,
    className: metadata?.objekt.class as string,
    memberName: metadata?.objekt.member as string,
    season: metadata?.objekt.season as string,
    collection: metadata?.objekt.collectionNo as string,
    type: collectionMap[(metadata?.objekt.collectionNo as string).at(-1) ?? 'Z'],
    num: metadata?.objekt.objektNo as number
  }
}
