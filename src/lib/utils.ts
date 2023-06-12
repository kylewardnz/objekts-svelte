import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Filter, Objekt } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate available properties to filter by, depending on the currently loaded objekts.
 * @param input Objekt[]
 * @returns Filter[]
 */
export function generateFilters(input: Objekt[]): Filter[] {
  const filters: Filter[] = []
  const properties: (keyof Objekt)[] = ['className', 'season', 'type']

  for (const property of properties) {
    const values = input.map((objekt) => objekt[property]).filter((value, index, self) => self.indexOf(value) === index)
    filters.push(...values.map((value) => ({
      label: property === 'className' ? 'class' : property,
      property,
      value: value as string,
    })))
  }

  return filters
}