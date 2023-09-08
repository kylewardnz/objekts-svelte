import type { Filter, Objekt } from './types'
import memberList from '../members.json'
import { pipe } from './utils'

type FilterInput = {
  input: Objekt[]
  attributeFilters: Filter[]
  collectionFilters: string[]
  sort: string
  members: string[]
  filterMode: 'and' | 'or'
  showAll?: boolean
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
export function executeFilters({
  input,
  attributeFilters,
  collectionFilters,
  sort,
  members,
  filterMode,
  showAll = true
}: FilterInput) {
  return pipe(
    input,
    (obj) => filterMembers(obj, members, showAll),
    (obj) => orderBy(obj, sort),
    (obj) => filterProperties(obj, attributeFilters, filterMode),
    (obj) => filterCollections(obj, collectionFilters)
  )
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
 * @param showAll boolean
 * @returns Objekt[]
 */
function filterMembers(input: Objekt[], members: string[], showAll: boolean) {
  if (members.length === 0) return showAll ? input : []

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
 * @param attributeFilters {@link Filter[]}
 * @param filterMode 'and' | 'or'
 * @returns Objekt[]
 */
function filterProperties(input: Objekt[], attributeFilters: Filter[], filterMode: 'and' | 'or') {
  return input.filter((objekt) => {
    // show all by default
    if (attributeFilters.length === 0) {
      return true
    }

    const matches = []
    for (const filter of attributeFilters) {
      matches.push(objekt[filter.property] === filter.value)
    }
    return filterMode === 'and' ? matches.every((x) => x === true) : matches.some((x) => x === true)
  })
}

/**
 * Filter objekts by selected collections.
 * @param input {@link Objekt[]}
 * @param collectionFilters {@link string[]}
 * @returns Objekt[]
 */
function filterCollections(input: Objekt[], collectionFilters: string[]) {
  if (collectionFilters.length === 0) return input

  return input.filter((objekt) => {
    return collectionFilters.includes(objekt.collection)
  })
}
