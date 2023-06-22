import { find } from '$lib/server/cosmo'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { isAddress } from '$lib/utils'

export const load = (async ({ params }) => {
  const isUser = isAddress(params.user) === false

  let address: string
  try {
    address = isUser ? await find(params.user) : params.user
  } catch (e) {
    throw error(404, 'Address not found')
  }

  try {
    return {
      name: isUser ? params.user : address.slice(0, 6),
      address
    }
  } catch (e) {
    throw error(404, 'Error fetching user')
  }
}) satisfies PageServerLoad
