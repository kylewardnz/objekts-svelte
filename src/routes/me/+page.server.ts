import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
  if (!cookies.get('token')) {
    throw redirect(307, '/me/signin')
  }
}

export const actions = {
  logout: async (event) => {
    event.cookies.delete('token')
  }
} satisfies Actions
