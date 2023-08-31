import { decodeToken } from '$lib/server/jwt'
import type { Handle } from '@sveltejs/kit'

// read the token and apply the decoded profile details into the locals store
export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token')
  if (token) {
    const decoded = await decodeToken(token)
    if (decoded.success) {
      event.locals.user = decoded.payload
    } else {
      event.cookies.delete('token')
    }
  }

  return await resolve(event)
}
