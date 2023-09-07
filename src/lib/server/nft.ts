import type { ObjektPage } from '$lib/types'
import { error } from '@sveltejs/kit'
import { fetchNftsForOwner, fetchTokenBalances, type RawAlchemyObjekt } from './alchemy'
import type { Objekt } from '$lib/types'
import { v4 } from 'uuid'

const REGEX = /4x$/i

const OBJEKT_TRIPLES = '0xA4B37bE40F7b231Ee9574c4b16b7DDb7EAcDC99B'
const OBJEKT_ARTMS = '0x0fB69F54bA90f17578a59823E09e5a1f8F3FA200'
const COMO_TRIPLES = '0x58AeABfE2D9780c1bFcB713Bf5598261b15dB6e5'
const COMO_ARTMS = '0x8254D8D2903B20187cBC4Dd833d49cECc219F32E'

const collectionMap: Record<string, 'physical' | 'digital'> = {
  A: 'physical',
  Z: 'digital'
}

/**
 * Fetch all objekts for a given address and page.
 * @param address string
 * @param pageKey string | null
 * @returns Promise<ObjektPage>
 */
export async function fetchByPage(address: string, pageKey: string | null): Promise<ObjektPage> {
  try {
    const response = await fetchNftsForOwner({
      address,
      contracts: [OBJEKT_TRIPLES, OBJEKT_ARTMS],
      orderBy: 'transferTime',
      pageKey: pageKey ?? undefined
    })

    const mappedObjekts = response.ownedNfts
      // filter out NFTs without metadata - should never happen
      .filter((nft) => nft.raw?.metadata?.objekt !== undefined)
      .map(mapNftToObjekt)

    return {
      totalCount: response.totalCount,
      objekts: mappedObjekts,
      pageKey: response.pageKey
    }
  } catch (err) {
    console.error(err)
    throw error(500, 'Error fetching objekts')
  }
}

/**
 * Map a raw NFT from Alchemy to an Objekt.
 * @param {RawAlchemyObjekt} nft
 * @returns {Objekt}
 */
function mapNftToObjekt(nft: RawAlchemyObjekt): Objekt {
  return {
    frontImage: (nft.raw?.metadata?.objekt.frontImage as string).replace(REGEX, '1x'),
    backImage: (nft.raw?.metadata?.objekt.backImage as string).replace(REGEX, '1x'),
    className: nft.raw?.metadata?.objekt.class as string,
    memberName: nft.raw?.metadata?.objekt.member as string,
    season: nft.raw?.metadata?.objekt.season as string,
    collection: nft.raw?.metadata?.objekt.collectionNo as string,
    type: collectionMap[(nft.raw?.metadata?.objekt.collectionNo as string).at(-1) ?? 'Z'],
    num: nft.raw?.metadata?.objekt.objektNo as number,
    tokenId: parseInt(nft.tokenId),
    acquiredAt: (nft.acquiredAt?.blockTimestamp
      ? new Date(nft.acquiredAt.blockTimestamp)
      : new Date()
    ).getTime(),
    transferable: nft.raw?.metadata?.objekt.transferable as boolean,
    // used to identify the objekt in the UI - ARTMS welcome objekts are on both contracts
    key: v4()
  }
}

type ComoBalances = {
  [contract: string]: number
}

/**
 * Fetches the token balances.
 * @param address string
 * @returns Promise<ComoBalances>
 */
export async function fetchComoBalances(address: string): Promise<ComoBalances> {
  const balances = await fetchTokenBalances({ address, contracts: [COMO_TRIPLES, COMO_ARTMS] })
  return balances.reduce((acc, balance) => {
    return { ...acc, [balance.contractAddress]: balance.tokenBalance }
  }, {})
}
