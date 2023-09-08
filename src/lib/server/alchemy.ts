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
 * @returns {Promise<NftResponse>}
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
    params.append('contractAddresses[]', contract)
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

type TokenBalanceRequest = {
  address: string
  contracts: string[]
}

type AlchemyBalanceResponse = {
  jsonrpc: string
  id: number
  result: {
    address: string
    tokenBalances: {
      contractAddress: string
      tokenBalance: string
    }[]
  }
}

type DecodedTokenBalance = {
  contractAddress: string
  tokenBalance: number
}

const POLYGON_DECIMALS = 18

/**
 * Fetch ERC20 token balances from the Alchemy API.
 *
 * @param {TokenBalanceRequest} config
 * @param {string} config.address
 * @param {string[]} config.contracts
 * @returns {Promise<DecodedTokenBalance[]>}
 */
export async function fetchTokenBalances({
  address,
  contracts
}: TokenBalanceRequest): Promise<DecodedTokenBalance[]> {
  const endpoint = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address, contracts]
      })
    })

    if (res.ok) {
      const data: AlchemyBalanceResponse = await res.json()
      return data.result.tokenBalances.map((balance) => ({
        contractAddress: balance.contractAddress,
        tokenBalance: parseInt(balance.tokenBalance) / 10 ** POLYGON_DECIMALS
      }))
    }

    return []
  } catch (err) {
    return []
  }
}

type NftMetadataResponse = RawAlchemyObjekt['raw']['metadata']

/**
 * Fetch metadata for a single NFT.
 * @param contractAddress string
 * @param tokenId number
 * @returns Promise<NftMetadataResponse>
 */
export async function fetchNftMetadata(
  contractAddress: string,
  tokenId: number
): Promise<NonNullable<NftMetadataResponse>> {
  const endpoint = `https://polygon-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getNFTMetadata`
  const params = new URLSearchParams({
    contractAddress,
    tokenId: tokenId.toString(),
    tokenType: 'ERC721'
  })

  try {
    const res = await fetch(endpoint + `?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })

    if (res.ok) {
      const { metadata } = await res.json()
      return metadata
    }

    throw new Error('Error fetching objekt metadata')
  } catch (err) {
    throw new Error('Error fetching objekt metadata')
  }
}
