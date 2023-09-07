import { redirect, type Actions, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { findUserByCosmo, updateUser } from '$lib/server/db/functions'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(307, '/me/signin')
  }

  const user = await findUserByCosmo(locals.user.nickname)
  if (!user) {
    throw redirect(307, '/me/signin')
  }

  return { user }
}

export const actions = {
  updateAccount: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { invalid: true })
    }

    const data = await request.formData()

    const isPrivate = data.get('isPrivate')

    if (!isPrivate) {
      return fail(400, { isPrivate, invalid: true })
    }

    await updateUser(locals.user.nickname, {
      isPrivate: isPrivate === 'true'
    })
    return { success: true }
  },

  logout: async (event) => {
    event.cookies.delete('token')
  }
} satisfies Actions
