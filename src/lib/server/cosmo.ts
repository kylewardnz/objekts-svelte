import { error } from '@sveltejs/kit'

/**
 * Search the given user in Cosmo and return its address.
 * @param user string
 * @returns Promise<string>
 */
export async function searchUser(user: string): Promise<string> {
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
