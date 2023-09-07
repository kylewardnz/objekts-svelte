import { user, type CosmoUser } from '$lib/server/cosmo'
import type { TokenPayload } from '$lib/server/jwt'
import { fetchComoBalances } from '$lib/server/nft'
import { error } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

/**
 * Fetches the Como balance from Polygon and maps it onto the Cosmo user.
 * @param decodedToken TokenPayload
 * @returns Promise<CosmoUser>
 */
async function fetchUserWithBalances(decodedToken: TokenPayload): Promise<CosmoUser> {
  const [cosmoUser, balances] = await Promise.allSettled([
    user(decodedToken.cosmoToken),
    fetchComoBalances(decodedToken.address)
  ])

  if (cosmoUser.status === 'rejected' || balances.status === 'rejected') {
    throw error(500, 'Failed to fetch user from Cosmo')
  }

  // map the on-chain como onto the cosmo user
  return {
    ...cosmoUser.value,
    artists: cosmoUser.value.artists.map((artist) => ({
      ...artist,
      assetBalance: {
        ...artist.assetBalance,
        totalComo: balances.value[artist.contracts.Como]
      }
    }))
  }
}

export const load: LayoutServerLoad = async ({ locals }) => {
  // fetch the user from cosmo if there's a token
  let cosmoUser: CosmoUser | undefined = undefined
  if (locals.user) {
    cosmoUser = await fetchUserWithBalances(locals.user)
  }

  return {
    signedIn: locals.user !== undefined,
    cosmoUser
  }
}
