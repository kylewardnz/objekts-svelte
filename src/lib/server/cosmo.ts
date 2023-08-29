import type { User } from '$lib/types'
import { error } from '@sveltejs/kit'
import { redis } from './cache'

const COSMO_ENDPOINT = 'https://api.cosmo.fans'

/**
 * Search for the given user.
 * @param term string
 * @returns Promise<User[]>
 */
export async function search(term: string): Promise<User[]> {
  // check cache first
  const query = await redis.get<User[]>(`search:${term.toLowerCase()}`)
  if (query) {
    return query
  }

  const res = await fetch(`${COSMO_ENDPOINT}/user/v1/search?query=${term}`)

  if (res.ok) {
    const { results } = await res.json()

    // set results in cache with a short expiry
    await redis.set(`search:${term.toLowerCase()}`, results, {
      ex: 60 * 15 // 15 minute expiry
    })

    return results
  }

  return []
}

/**
 * Find the given user in Cosmo and return its address.
 * @param user string
 * @returns Promise<string>
 */
export async function find(user: string): Promise<string> {
  // check cache first
  const cachedAddress = await redis.get<string>(`user:${user.toLowerCase()}`)
  if (cachedAddress) {
    return cachedAddress
  }

  const res = await fetch(`${COSMO_ENDPOINT}/user/v1/search?query=${user}`)

  if (res.ok) {
    const { results } = await res.json()
    if (results.length > 0) {
      // set address in cache
      await redis.set(`user:${user.toLowerCase()}`, results[0].address)

      // return address
      return results[0].address
    } else {
      throw error(404, 'Cosmo user not found')
    }
  }

  throw error(500, 'Error communicating with Cosmo')
}

type CosmoLoginResult = {
  user: {
    id: number
    email: string
    nickname: string
    address: string
    profileImageUrl: string
  }
  credentials: {
    accessToken: string
    refreshToken: string
  }
}

/**
 * Logs in with Cosmo and returns the access token.
 * @param email string
 * @param accessToken string
 * @returns Promise<string>
 */
export async function login(email: string, accessToken: string): Promise<string> {
  const res = await fetch(`${COSMO_ENDPOINT}/auth/v1/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: 'email',
      email,
      accessToken
    })
  })

  if (!res.ok) {
    const result = await res.json()
    console.log({ status: res.status, result })
    throw error(res.status, 'Failed to login')
  }

  const result: CosmoLoginResult = await res.json()
  return result.credentials.accessToken
}

type CosmoUserResult = {
  profile: {
    id: number
    email: string
    nickname: string
    address: string
    profileImageUrl: string
    followingArtists: {
      name: string
      title: string
      assetBalance: {
        totalComo: number
        totalObjekt: number
      }
    }[]
  }
}

export type CosmoUser = {
  nickname: string
  address: string
  profileImageUrl: string
  artists: {
    name: string
    title: string
    assetBalance: {
      totalComo: number
      totalObjekt: number
    }
  }[]
}

/**
 * Fetches the user from the access token.
 * @param accessToken string
 * @returns Promise<CosmoUser>
 */
export async function user(accessToken: string): Promise<CosmoUser> {
  const res = await fetch(`${COSMO_ENDPOINT}/user/v1/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!res.ok) {
    throw error(res.status, 'Failed to fetch user')
  }

  const result: CosmoUserResult = await res.json()
  return {
    nickname: result.profile.nickname,
    address: result.profile.address,
    profileImageUrl: result.profile.profileImageUrl,
    artists: result.profile.followingArtists
  }
}
