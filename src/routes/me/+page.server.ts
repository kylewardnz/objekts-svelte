import { redirect, type Actions, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { fetchAccount, updateAccount } from '$lib/server/account'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(307, '/me/signin')
  }

  return {
    account: await fetchAccount(locals.user.nickname)
  }
}

export const actions = {
  updateAccount: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { invalid: true })
    }

    const data = await request.formData()
    console.log(data)

    const isPrivate = data.get('isPrivate')

    if (!isPrivate) {
      return fail(400, { isPrivate, invalid: true })
    }

    await updateAccount(locals.user.nickname, {
      isPrivate: isPrivate === 'true'
    })
    return { success: true }
  },

  logout: async (event) => {
    event.cookies.delete('token')
  }
} satisfies Actions
