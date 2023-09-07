import { login } from '$lib/server/cosmo'
import { exchangeToken, sendEmail } from '$lib/server/ramper'
import { fail, type Actions } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { signToken } from '$lib/server/jwt'
import { NODE_ENV } from '$env/static/private'
import { upsertUser } from '$lib/server/db/functions'

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

    // exchange token with ramper
    const idToken = await exchangeToken(transactionId.toString(), pendingToken.toString())
    // login with cosmo
    const loginPayload = await login(email.toString(), idToken)
    // insert user into db
    await upsertUser(loginPayload.nickname, loginPayload.address)

    cookies.set('token', await signToken(loginPayload), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: true,
      secure: NODE_ENV !== 'development'
    })

    return { success: true }
  },

  logout: async (event) => {
    event.cookies.delete('token')
  }
} satisfies Actions
