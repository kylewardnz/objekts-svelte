import { searchUser } from '$lib/server/cosmo';
import { fetchAll } from '$lib/server/nft';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const isUser = /^0x[a-fA-F0-9]{40}$/g.test(params.user) === false

  try {
    const address = isUser ? await searchUser(params.user) : params.user

    return {
      name: isUser ? params.user : address.slice(0, 6),
      objekts: await fetchAll(address),
      address,
    }
  } catch (e) {
    throw error(404, 'Not found');
  }
}) satisfies PageServerLoad;

