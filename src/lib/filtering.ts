import type { Filter, Objekt } from './types'
import memberList from '../members.json'

type FilterInput = {
  input: Objekt[]
  filters: Filter[]
  sort: string
  members: string[]
  filterMode: 'and' | 'or'
}

// the position in the member JSON where the ARTMS members end
const ARTMS_OFFSET = 5

/**
 * Removes the online/offline identifier off the collection string.
 * @param c string
 * @returns number
 */
function colNum(c: string) {
  return parseInt(c.substring(0, c.length - 1))
}

/**
 * Execute all filters.
 * @param input {@link FilterInput}
 * @returns Objekt[]
 */
export function executeFilters({ input, filters, sort, members, filterMode }: FilterInput) {
  return filterProperties(orderBy(filterMembers(input, members), sort), filters, filterMode)
}

/**
 * Sorts objekts by the given sort string.
 * @param input {@link Objekt[]}
 * @param sort string
 * @returns Objekt[]
 */
function orderBy(input: Objekt[], sort: string) {
  switch (sort) {
    case 'recently-acquired':
      return input.slice().sort((a, b) => b.acquiredAt - a.acquiredAt)
    case 'oldest-acquired':
      return input.slice().sort((a, b) => a.acquiredAt - b.acquiredAt)
    case 'collection-asc':
      return input.slice().sort((a, b) => colNum(a.collection) - colNum(b.collection))
    case 'collection-desc':
      return input.slice().sort((a, b) => colNum(b.collection) - colNum(a.collection))
    case 'serial-asc':
      return input.slice().sort((a, b) => a.num - b.num)
    case 'serial-desc':
      return input.slice().sort((a, b) => b.num - a.num)
    default:
      return input
  }
}

/**
 * Filter objekts by the input member list.
 * @param input {@link Objekt[]}
 * @param members string[]
 * @returns Objekt[]
 */
function filterMembers(input: Objekt[], members: string[]) {
  if (members.length === 0) return input

  return input.filter((objekt) => {
    const existsS = members.includes('SSS')
    const existsA = members.includes('ARTMS')
    const filtered = []

    if (existsS) {
      const S = memberList.slice(ARTMS_OFFSET)
      filtered.push(...S.map((x) => x.filterValue))
    }

    if (existsA) {
      const A = memberList.slice(0, ARTMS_OFFSET)
      filtered.push(...A.map((x) => x.filterValue))
    }

    if (!existsS && !existsA) {
      filtered.push(...members)
    }

    return filtered.includes(objekt.memberName)
  })
}

/**
 * Filter objekts by selected attribute properties.
 * @param input {@link Objekt[]}
 * @param selectedFilters {@link Filter[]}
 * @param filterMode 'and' | 'or'
 * @returns Objekt[]
 */
function filterProperties(input: Objekt[], selectedFilters: Filter[], filterMode: 'and' | 'or') {
  return input.filter((objekt) => {
    // show all by default
    if (selectedFilters.length === 0) {
      return true
    }

    const matches = []
    for (const filter of selectedFilters) {
      matches.push(objekt[filter.property] === filter.value)
    }
    return filterMode === 'and' ? matches.every((x) => x === true) : matches.some((x) => x === true)
  })
}
