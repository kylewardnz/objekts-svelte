type GetNFTsForContractResponse = {
  pageKey: string
  nfts: {
    tokenId: string
    name: string
    raw: {
      metadata: {
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
  }[]
}

export async function getNFTsForContract(contractAddress: string, startToken = '') {
  const apiKey = process.env.ALCHEMY_KEY
  if (!apiKey) {
    throw new Error('No Alchemy API key provided')
  }

  const params = new URLSearchParams({
    contractAddress,
    startToken,
    withMetadata: 'true'
  })

  const response = await fetch(
    `https://polygon-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForContract?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch NFTs for contract ${contractAddress}`)
  }

  const data: GetNFTsForContractResponse = await response.json()
  return data
}
