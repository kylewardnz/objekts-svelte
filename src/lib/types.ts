export type Objekt = {
  frontImage: string
  backImage: string
  className: string
  memberName: string
  season: string
  collection: string
  type: 'physical' | 'digital'
  num: number
  tokenId: number
  acquiredAt: number
  transferable: boolean
  key: string
}

export type User = {
  nickname: string
  profileImageUrl: string
}

export type Filter = {
  label: string
  property: keyof Objekt
  value: string
}

export type ObjektPage = {
  totalCount: number
  objekts: Objekt[]
  pageKey: string | undefined
}
