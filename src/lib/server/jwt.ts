import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'

export type TokenPayload = {
  id: number
  email: string
  nickname: string
  address: string
  cosmoToken: string
}

/**
 * Generate a token with the given payload.
 * @param payload TokenPayload
 * @returns string
 */
export function signToken(payload: TokenPayload) {
  return jwt.sign({ data: payload }, JWT_SECRET, {
    expiresIn: '7d'
  })
}

type TokenResult =
  | {
      success: true
      payload: TokenPayload
    }
  | {
      success: false
      error: jwt.VerifyErrors['name']
    }

/**
 * Decode the given token.
 * @param token string
 * @returns TokenResult
 */
export function decodeToken(token: string): TokenResult {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      maxAge: '1h'
    })
    if (typeof payload !== 'object' || !('data' in payload)) {
      throw new jwt.JsonWebTokenError('Invalid token')
    }

    return {
      success: true,
      payload: payload.data as TokenPayload
    }
  } catch (err) {
    const error = err as jwt.VerifyErrors
    return {
      success: false,
      error: error.name
    }
  }
}
