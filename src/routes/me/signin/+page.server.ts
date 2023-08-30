import { login } from '$lib/server/cosmo'
import { exchangeToken, sendEmail } from '$lib/server/ramper'
import { fail, type Actions } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
  if (cookies.get('token')) {
    throw redirect(307, '/me')
  }
}

export const actions = {
  sendEmail: async ({ request }) => {
    const data = await request.formData()

    const transactionId = data.get('transactionId')
    if (!transactionId) {
      return fail(400, { transactionId, invalid: true })
    }

    const email = data.get('email')
    if (!email) {
      return fail(400, { email, invalid: true })
    }

    const pendingToken = await sendEmail(transactionId.toString(), email.toString())

    return { success: true, pendingToken }
  },

  exchangeCode: async ({ cookies, request }) => {
    const data = await request.formData()

    const transactionId = data.get('transactionId')
    if (!transactionId) {
      return fail(400, { transactionId, invalid: true })
    }

    const pendingToken = data.get('pendingToken')
    if (!pendingToken) {
      return fail(400, { pendingToken, invalid: true })
    }

    const email = data.get('email')
    if (!email) {
      return fail(400, { email, invalid: true })
    }

    const idToken = await exchangeToken(transactionId.toString(), pendingToken.toString())
    const cosmoToken = await login(email.toString(), idToken)

    cookies.set('token', cosmoToken, {
      path: '/'
    })

    return { success: true }
  },

  logout: async (event) => {
    event.cookies.delete('token')
  }
} satisfies Actions
