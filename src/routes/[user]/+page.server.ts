import { find } from '$lib/server/cosmo'
import { fetchAll } from '$lib/server/nft'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
  const isUser = /^0x[a-fA-F0-9]{40}$/g.test(params.user) === false

  let address: string
  try {
    address = isUser ? await find(params.user) : params.user
  } catch (e) {
    throw error(404, 'Address not found')
  }

  try {
    return {
      name: isUser ? params.user : address.slice(0, 6),
      objekts: await fetchAll(address),
      address
    }
  } catch (e) {
    throw error(404, 'Error fetching objekts')
  }
}) satisfies PageServerLoad
