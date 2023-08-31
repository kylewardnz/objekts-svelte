import { find } from '$lib/server/cosmo'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { isAddress } from '$lib/utils'
import { fetchAccount } from '$lib/server/account'

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
 * @param user string
 * @returns Promise<UserProfile>
 */
async function fetchByUsername(user: string): Promise<UserProfile> {
  const [address, settings] = await Promise.all([find(user), fetchAccount(user)])

  const isPrivate = settings?.isPrivate ?? false
  if (isPrivate) {
    return {
      name: user,
      isPrivate: true
    }
  }

  return {
    name: user,
    isPrivate: false,
    address
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

export const load = (async ({ params }) => {
  const isUser = isAddress(params.user) === false

  try {
    return await (isUser ? fetchByUsername(params.user) : fetchByAddress(params.user))
  } catch (e) {
    throw error(422, 'Error fetching user')
  }
}) satisfies PageServerLoad
