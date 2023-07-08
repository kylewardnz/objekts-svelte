import { Alchemy, Network, NftOrdering } from 'alchemy-sdk'
import { ALCHEMY_KEY } from '$env/static/private'
import type { ObjektPage } from '$lib/types'
import { error } from '@sveltejs/kit'

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
  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: Network.MATIC_MAINNET
  })

  try {
    const response = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: CONTRACTS,
      orderBy: NftOrdering.TRANSFERTIME,
      pageKey: pageKey ?? undefined
    })

    const mappedObjekts = response.ownedNfts
      .filter((nft) => nft.rawMetadata?.objekt !== undefined)
      // filter out duplicate tokenIds - ARTMS welcome objekts are on both contracts
      .filter((nft, index, self) => self.findIndex((n) => n.tokenId === nft.tokenId) === index)
      .map((nft) => ({
        frontImage: (nft.rawMetadata?.objekt.frontImage as string).replace(REGEX, '1x'),
        backImage: (nft.rawMetadata?.objekt.backImage as string).replace(REGEX, '1x'),
        className: nft.rawMetadata?.objekt.class as string,
        memberName: nft.rawMetadata?.objekt.member as string,
        season: nft.rawMetadata?.objekt.season as string,
        collection: nft.rawMetadata?.objekt.collectionNo as string,
        type: collectionMap[(nft.rawMetadata?.objekt.collectionNo as string).at(-1) ?? 'Z'],
        num: nft.rawMetadata?.objekt.objektNo as number,
        tokenId: Number(nft.rawMetadata?.objekt.tokenId),
        acquiredAt: (nft.acquiredAt?.blockTimestamp
          ? new Date(nft.acquiredAt.blockTimestamp)
          : new Date()
        ).getTime(),
        transferable: nft.rawMetadata?.objekt.transferable as boolean
      }))

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
