import { ALCHEMY_KEY } from '$env/static/private'

type NFTFetchRequest = {
  address: string
  contracts: string[]
  orderBy?: 'transferTime'
  pageKey?: string
}

type NftResponse = {
  ownedNfts: RawAlchemyObjekt[]
  pageKey?: string
  totalCount: number
}

export type RawAlchemyObjekt = {
  acquiredAt: {
    blockTimestamp: string
    blockNumber: number
  }
  tokenId: string
  raw: {
    metadata:
      | undefined
      | {
          name: string
          description: string
          objekt: {
            backgroundColor: string
            comoAmount: number
            frontImage: string
            tokenId: string
            accentColor: string
            transferable: boolean
            textColor: string
            backImage: string
            tokenAddress: string
            objektNo: number
            artists: string[]
            member: string
            season: string
            collectionNo: string
            thumbnailImage: string
            collectionId: string
            class: string
            transferableByDefault: boolean
          }
        }
  }
}

const PAGE_SIZE = 100

/**
 * Fetch NFTs from the Alchemy API.
 *
 * @param {NFTFetchRequest} config
 * @param {string} config.address
 * @param {string[]} config.contracts
 * @param {string | undefined} config.orderBy
 * @param {string | undefined} config.pageKey
 * @returns {NFTFetchResponse}
 */
export async function fetchNftsForOwner({
  address,
  contracts,
  orderBy,
  pageKey
}: NFTFetchRequest): Promise<NftResponse> {
  const endpoint = `https://polygon-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}/getNFTsForOwner`
  const params = new URLSearchParams({
    owner: address,
    withMetadata: 'true',
    pageSize: PAGE_SIZE.toString()
  })

  contracts.forEach((contract) => {
    params.append('contractAddresses', contract)
  })
  if (orderBy) {
    params.append('orderBy', orderBy)
  }
  if (pageKey) {
    params.append('pageKey', pageKey)
  }

  try {
    const res = await fetch(endpoint + `?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })

    const data = await res.json()
    return {
      ownedNfts: data.ownedNfts ?? [],
      pageKey: data.pageKey ?? undefined,
      totalCount: parseInt(data.totalCount)
    }
  } catch (err) {
    throw new Error('Error fetching objekts')
  }
}
