// See https://kit.svelte.dev/docs/types#app

import type { TokenPayload } from '$lib/server/jwt'

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: TokenPayload
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {}
