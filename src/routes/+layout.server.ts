import { user, type CosmoUser } from '$lib/server/cosmo'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  const token = locals.user?.cosmoToken

  // fetch the user from cosmo if there's a token
  let cosmoUser: CosmoUser | undefined = undefined
  if (token) {
    cosmoUser = await user(token)
  }

  return {
    signedIn: token !== undefined,
    cosmoUser
  }
}
