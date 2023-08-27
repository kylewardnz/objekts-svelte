import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Filter, Objekt } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// https://www.nexxel.dev/blog/pipe
interface Pipe {
  <A>(value: A): A
  <A, B>(value: A, fn1: (input: A) => B): B
  <A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): C
  <A, B, C, D>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): D
  <A, B, C, D, E>(
    value: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D,
    fn4: (input: D) => E
  ): E
}
type PipeFunction = <T>(input: T) => T

export const pipe: Pipe = <T>(value: T, ...fns: PipeFunction[]): unknown => {
  return fns.reduce((acc, fn) => fn(acc), value)
}

/**
 * Generate available properties to filter by, depending on the currently loaded objekts.
 * @param input Objekt[]
 * @returns Filter[]
 */
export function generateAttributeFilters(input: Objekt[]): Filter[] {
  const filters: Filter[] = []
  const properties: (keyof Objekt)[] = ['className', 'season', 'type', 'transferable']

  for (const property of properties) {
    const values = input
      .map((objekt) => objekt[property])
      .filter((value, index, self) => self.indexOf(value) === index)
    filters.push(
      ...values.map((value) => ({
        label: property === 'className' ? 'class' : property,
        property,
        value: value as string
      }))
    )
  }

  return filters
}

/**
 * Generate available collections to filter by, depending on the currently loaded objekts.
 * @param input Objekt[]
 * @returns string[]
 */
export function generateCollectionFilters(input: Objekt[]): string[] {
  return input
    .map((objekt) => objekt.collection)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b))
}

/**
 * Determine if a string is an Ethereum address or a user.
 * @param user string
 * @returns boolean
 */
export const isAddress = (user: string) => /^0x[a-fA-F0-9]{40}$/g.test(user) === true
