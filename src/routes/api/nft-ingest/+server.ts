import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { fetchNft } from '$lib/server/nft'
import { db } from '$lib/server/db'
import { objekts } from '$lib/server/db/schema'
import { ALCHEMY_WEBHOOK_KEY } from '$env/static/private'

type NFTActivityWebhook = {
  webhookId: string
  id: string
  createdAt: string
  event: {
    network: 'MATIC_MAINNET'
    activity: {
      fromAddress: string
      toAddress: string
      contractAddress: string
      erc721TokenId: string
    }[]
  }
}

export const POST = (async ({ request }) => {
  const body = await request.text()
  const valid = await validateWebhook(request.headers.get('x-alchemy-signature'), body)
  if (!valid) {
    return json('invalid signature')
  }

  const payload: NFTActivityWebhook = JSON.parse(body)
  if (!payload.event.activity || payload.event.activity.length === 0) {
    return json('ok')
  }

  // fetch metadata for the incoming objekt
  const { contractAddress, erc721TokenId } = payload.event.activity[0]
  const objekt = await fetchNft(contractAddress, parseInt(erc721TokenId))

  console.log(
    `[nft-ingest] webhook received: ${objekt.season} ${objekt.memberName} ${objekt.collection}`
  )

  // upsert into the database
  await db.insert(objekts).ignore().values({
    frontImage: objekt.frontImage,
    backImage: objekt.backImage,
    className: objekt.className,
    memberName: objekt.memberName,
    season: objekt.season,
    collection: objekt.collection,
    type: objekt.type
  })

  return json('ok')
}) satisfies RequestHandler

/**
 * Validates the incoming webhook.
 * @param signature string
 * @param payload string
 * @returns Promise<boolean>
 */
async function validateWebhook(signature: string | null, payload: string) {
  const encoder = new TextEncoder()
  const key = encoder.encode(ALCHEMY_WEBHOOK_KEY)

  try {
    const importedKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // generate the hmac signature using the imported key
    const signatureBuffer = await crypto.subtle.sign('HMAC', importedKey, encoder.encode(payload))

    // convert signature to a hexadecimal string
    const digest = Array.from(new Uint8Array(signatureBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')

    return signature === digest
  } catch (err) {
    return false
  }
}
