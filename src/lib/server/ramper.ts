import { RAMPER_ENDPOINT, COSMO_APP_ID } from '$env/static/private'
import { error } from '@sveltejs/kit'

type AppSendResult = {
  success: true
  pendingToken: string
}

/**
 * Sends the email to Ramper for magic link generation.
 * @param transactionId string
 * @param email string
 * @returns Promise<string>
 */
export async function sendEmail(transactionId: string, email: string): Promise<string> {
  const response = await fetch(`${RAMPER_ENDPOINT}/appSend`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      appId: COSMO_APP_ID,
      transactionId,
      email
    })
  })

  if (!response.ok) {
    throw error(response.status, 'Failed to send email')
  }

  const result: AppSendResult = await response.json()
  return result.pendingToken
}

type ExchangeTokenResult =
  | {
      success: true
      customToken: string
      newAccount: boolean
      ssoCredential: {
        idToken: string
        refreshToken: string
        rt2: string
      }
    }
  | {
      success: false
      error: string
    }

type CosmoTokenResult =
  | {
      success: true
      token: string
    }
  | {
      success: false
      error: string
    }

/**
 * Exchange the pending token for a session token.
 * @param transactionId string
 * @param pendingToken string
 * @returns Promise<CosmoTokenResult>
 */
export async function exchangeToken(
  transactionId: string,
  pendingToken: string
): Promise<CosmoTokenResult> {
  const response = await fetch(`${RAMPER_ENDPOINT}/exchangeToken`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      appId: COSMO_APP_ID,
      transactionId,
      pendingToken
    })
  })

  if (!response.ok) {
    throw error(response.status, 'Failed to exchange token')
  }

  const result: ExchangeTokenResult = await response.json()
  if (result.success) {
    return {
      success: true,
      token: result.ssoCredential.idToken
    }
  }

  return { success: false, error: result.error }
}
