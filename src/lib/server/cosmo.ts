import type { User } from '$lib/types'
import { error } from '@sveltejs/kit'
import { redis } from './cache'

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

  const res = await fetch(`https://api.cosmo.fans/user/v1/search?query=${term}`)

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

  const res = await fetch(`https://api.cosmo.fans/user/v1/search?query=${user}`)

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
