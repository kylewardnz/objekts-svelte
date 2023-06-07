import type { User } from '$lib/types'
import { error } from '@sveltejs/kit'

/**
 * Search for the given user.
 * @param user string
 * @returns Promise<User[]>
 */
export async function search(user: string): Promise<User[]> {
  const res = await fetch(`https://api.cosmo.fans/user/v1/search?query=${user}`)

  if (res.ok) {
    const { results } = await res.json()
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
  const res = await fetch(`https://api.cosmo.fans/user/v1/search?query=${user}`)

  if (res.ok) {
    const { results } = await res.json()
    if (results.length > 0) {
      return results[0].address
    } else {
      throw error(404, 'Cosmo user not found')
    }
  }

  throw error(500, 'Error communicating with Cosmo')
}
