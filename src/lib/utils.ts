import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { cubicOut } from 'svelte/easing'
import type { TransitionConfig } from 'svelte/transition'
import type { Filter, Objekt } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FlyAndScaleParams = {
  y?: number
  x?: number
  start?: number
  duration?: number
}

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node)
  const transform = style.transform === 'none' ? '' : style.transform

  const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
    const [minA, maxA] = scaleA
    const [minB, maxB] = scaleB

    const percentage = (valueA - minA) / (maxA - minA)
    const valueB = percentage * (maxB - minB) + minB

    return valueB
  }

  const styleToString = (style: Record<string, number | string | undefined>): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str
      return str + `${key}:${style[key]};`
    }, '')
  }

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0])
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0])
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1])

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      })
    },
    easing: cubicOut
  }
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
