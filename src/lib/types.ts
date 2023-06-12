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
}

export type User = {
  nickname: string
  address: string
  profileImageUrl: string
}

export type Filter = {
  label: string
  property: keyof Objekt
  value: string
}