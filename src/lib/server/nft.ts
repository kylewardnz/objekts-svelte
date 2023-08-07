import type { ObjektPage } from '$lib/types'
import { error } from '@sveltejs/kit'
import { fetchNftsForOwner, type RawAlchemyObjekt } from './alchemy'
import type { Objekt } from '$lib/types'
import { v4 } from 'uuid'

const REGEX = /4x$/i

const CONTRACTS = [
  '0xA4B37bE40F7b231Ee9574c4b16b7DDb7EAcDC99B', // tripleS
  '0x0fB69F54bA90f17578a59823E09e5a1f8F3FA200' // ARTMS
]

const collectionMap: Record<string, 'physical' | 'digital'> = {
  A: 'physical',
  Z: 'digital'
}

export async function fetchByPage(address: string, pageKey: string | null): Promise<ObjektPage> {
  try {
    const response = await fetchNftsForOwner({
      address,
      contracts: CONTRACTS,
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
