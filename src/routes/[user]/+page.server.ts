import { find } from '$lib/server/cosmo'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { isAddress } from '$lib/utils'

type PublicProfile = {
  isPrivate: false
  name: string
  address: string
}

type PrivateProfile = {
  name: string
  isPrivate: true
}

type UserProfile = PublicProfile | PrivateProfile

/**
 * Returns a user profile by its Cosmo username.
 * @param nickname string
 * @param currentUser string | undefined
 * @returns Promise<UserProfile>
 */
async function fetchByNickname(nickname: string, currentUser?: string): Promise<UserProfile> {
  const user = await find(nickname)

  // allow the user in if they're viewing their own profile
  const isPrivate = user.isPrivate && currentUser !== nickname
  if (isPrivate) {
    return {
      name: nickname,
      isPrivate: true
    }
  }

  return {
    name: nickname,
    isPrivate: false,
    address: user.polygonAddress
  }
}

/**
 * Returns a user profile by its address.
 * @param address string
 * @returns Promise<UserProfile>
 */
async function fetchByAddress(address: string): Promise<UserProfile> {
  return {
    name: address.slice(0, 6),
    isPrivate: false,
    address
  }
}

export const load = (async ({ params, locals }) => {
  const isUser = isAddress(params.user) === false

  try {
    return await (isUser
      ? fetchByNickname(params.user, locals.user?.nickname)
      : fetchByAddress(params.user))
  } catch (e) {
    throw error(422, 'Error fetching user')
  }
}) satisfies PageServerLoad
