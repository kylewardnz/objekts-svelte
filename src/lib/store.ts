import { writable } from 'svelte/store'
import type { CosmoUser } from '$lib/server/cosmo'

export const selected = writable<string[]>(['SSS', 'ARTMS'])

export const isSignedIn = writable<boolean>(false)
export const cosmoUser = writable<CosmoUser | undefined>()
