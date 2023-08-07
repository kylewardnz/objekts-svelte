import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { fetchByPage } from '$lib/server/nft'
import { isAddress } from '$lib/utils'
import type { Config } from '@sveltejs/adapter-vercel'

export const config: Config = {
  runtime: 'nodejs18.x'
}

export const GET = (async ({ params, url }) => {
  if (!isAddress(params.user)) {
    throw error(422, 'Invalid address')
  }

  return json(await fetchByPage(params.user, url.searchParams.get('pageKey')))
}) satisfies RequestHandler
