import type { ObjektPage } from '$lib/types'
import {
  fetchNftMetadata,
  fetchNftsForOwner,
  fetchTokenBalances,
  type RawAlchemyObjekt
} from './alchemy'
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
    throw new Error('Error fetching objekts')
  }
}

function mapCommonObjektFields(metadata: RawAlchemyObjekt['raw']['metadata']) {
  return {
    frontImage: (metadata?.objekt.frontImage as string).replace(REGEX, '1x'),
    backImage: (metadata?.objekt.backImage as string).replace(REGEX, '1x'),
    className: metadata?.objekt.class as string,
    memberName: metadata?.objekt.member as string,
    season: metadata?.objekt.season as string,
    collection: metadata?.objekt.collectionNo as string,
    type: collectionMap[(metadata?.objekt.collectionNo as string).at(-1) ?? 'Z'],
    num: metadata?.objekt.objektNo as number
  }
}

/**
 * Map a raw NFT from Alchemy to an Objekt.
 * @param {RawAlchemyObjekt} nft
 * @returns {Objekt}
 */
function mapNftToObjekt(nft: RawAlchemyObjekt): Objekt {
  return {
    ...mapCommonObjektFields(nft.raw?.metadata),
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

type UniqueObjekt = Omit<Objekt, 'acquiredAt' | 'transferable' | 'key'>

/**
 * Fetch the metadata for a single NFT.
 * @param contract string
 * @param tokenId number
 * @returns Promise<UniqueObjekt>
 */
export async function fetchNft(contract: string, tokenId: number): Promise<UniqueObjekt> {
  try {
    const response = await fetchNftMetadata(contract, tokenId)
    return {
      ...mapCommonObjektFields(response),
      tokenId: parseInt(response.objekt.tokenId)
    }
  } catch (err) {
    throw new Error('Error fetching objekt')
  }
}
