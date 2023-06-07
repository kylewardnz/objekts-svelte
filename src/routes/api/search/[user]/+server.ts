import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { search } from '$lib/server/cosmo'

export const GET = (async ({ params }) => {
  const users = await search(params.user)
  return json(users.slice(0, 7))
}) satisfies RequestHandler
