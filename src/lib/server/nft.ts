import { Alchemy, Network, NftOrdering, type OwnedNft } from 'alchemy-sdk'
import { ALCHEMY_KEY } from '$env/static/private'
import type { Objekt } from '$lib/types'

const CONTRACTS = [
  '0xA4B37bE40F7b231Ee9574c4b16b7DDb7EAcDC99B', // tripleS
  '0x0fB69F54bA90f17578a59823E09e5a1f8F3FA200', // ARTMS
]

const collectionMap: Record<string, 'physical' | 'digital'> = {
  A: 'physical',
  Z: 'digital',
}

export async function fetchAll(address: string): Promise<Objekt[]> {
  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: Network.MATIC_MAINNET
  })

  const nfts: OwnedNft[] = []
  let pageKey: string | undefined
  let done = false

  while (pageKey !== undefined || done === false) {
    const response = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: CONTRACTS,
      orderBy: NftOrdering.TRANSFERTIME,
      pageKey
    })
    nfts.push(...response.ownedNfts)
    pageKey = response.pageKey
    if (pageKey === undefined) done = true
  }

  return nfts
    .filter((nft) => nft.rawMetadata?.objekt !== undefined)
    // filter out duplicate tokenIds - ARTMS welcome objekts are on both contracts
    .filter((nft, index, self) => self.findIndex((n) => n.tokenId === nft.tokenId) === index)
    .map((nft) => ({
      frontImage: nft.rawMetadata?.objekt.frontImage,
      backImage: nft.rawMetadata?.objekt.backImage as string,
      className: nft.rawMetadata?.objekt.class as string,
      memberName: nft.rawMetadata?.objekt.member as string,
      season: nft.rawMetadata?.objekt.season as string,
      collection: nft.rawMetadata?.objekt.collectionNo as string,
      type: collectionMap[(nft.rawMetadata?.objekt.collectionNo as string).at(-1) ?? 'Z'],
      num: nft.rawMetadata?.objekt.objektNo as number,
      tokenId: Number(nft.rawMetadata?.objekt.tokenId),
      acquiredAt: (nft.acquiredAt?.blockTimestamp ? new Date(nft.acquiredAt.blockTimestamp) : new Date()).getTime()
    }))
}
