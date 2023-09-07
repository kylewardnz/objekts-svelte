import type { SearchUser } from '$lib/types'
import { error } from '@sveltejs/kit'
import { redis } from '$lib/server/cache'
import { findUserByCosmo, upsertUser } from '$lib/server/db/functions'
import type { User } from './db/schema'

const COSMO_ENDPOINT = 'https://api.cosmo.fans'

type CosmoSearchResult = {
  results: {
    nickname: string
    address: string
    profileImageUrl: string
  }[]
}

/**
 * Search for the given user.
 * @param term string
 * @returns Promise<User[]>
 */
export async function search(term: string): Promise<SearchUser[]> {
  // check cache first
  const query = await redis.get<SearchUser[]>(`search:${term.toLowerCase()}`)
  if (query) {
    return query
  }

  const res = await fetch(`${COSMO_ENDPOINT}/user/v1/search?query=${term}`)

  if (res.ok) {
    const data: CosmoSearchResult = await res.json()
    const sanitized = data.results.map((user) => ({
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl
    }))

    // set results in cache with a short expiry
    await redis.set(`search:${term.toLowerCase()}`, sanitized, {
      ex: 60 * 15 // 15 minute expiry
    })

    return sanitized
  }

  return []
}

/**
 * Find the given user in Cosmo.
 * @param user string
 * @returns Promise<User>
 */
export async function find(user: string): Promise<User> {
  // check cache first
  const cachedUser = await findUserByCosmo(user)
  if (cachedUser) {
    return cachedUser
  }

  const res = await fetch(`${COSMO_ENDPOINT}/user/v1/search?query=${user}`)

  if (res.ok) {
    const data: CosmoSearchResult = await res.json()
    if (data.results.length > 0) {
      const cosmoUser = data.results[0]

      // set address in cache
      await upsertUser(cosmoUser.nickname, cosmoUser.address)

      // return user
      return {
        cosmoNickname: cosmoUser.nickname,
        polygonAddress: cosmoUser.address,
        isPrivate: false
      }
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

type LoginResult = {
  id: number
  email: string
  nickname: string
  address: string
  cosmoToken: string
}

/**
 * Logs in with Cosmo and returns the access token.
 * @param email string
 * @param accessToken string
 * @returns Promise<LoginResult>
 */
export async function login(email: string, accessToken: string): Promise<LoginResult> {
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
    throw error(res.status, 'Failed to login')
  }

  const result: CosmoLoginResult = await res.json()
  return {
    id: result.user.id,
    email: result.user.email,
    nickname: result.user.nickname,
    address: result.user.address,
    cosmoToken: result.credentials.accessToken
  }
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
