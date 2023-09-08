import { db } from '$lib/server/db'
import { objekts as objektsTable } from '$lib/server/db/schema'
import type { Objekt } from '$lib/types'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  const objekts = await db.select().from(objektsTable)

  return {
    objekts: objekts.map((objekt) => ({
      ...objekt,
      // append for compatibility despite not needing
      transferable: true,
      num: 1,
      acquiredAt: 1694189620,
      tokenId: objekt.id,
      key: objekt.id.toString()
    })) as Objekt[]
  }
}) satisfies PageServerLoad
