export type SubmissionStats = {
  holders: {
    1: number
    4: number
    5: number
    10: number
    20: number
    40: number
    total: number
  }
  opepens: {
    1: number
    4: number
    5: number
    10: number
    20: number
    40: number
    total: number
  }
  demand: {
    1: number
    4: number
    5: number
    10: number
    20: number
    40: number
    total: number
  }
  totalHolders?: number
}

export type EditionType = 'PRINT' | 'NUMBERED_PRINT' | 'DYNAMIC'

export type ArtistSignature = {
  set: number
  name: string
  artist: string
  note?: string
  tx?: string
}

export type ArtistSocials = string[]

export type ImageVersions = {
  sm?: boolean // 512
  lg?: boolean // 1024
  xl?: boolean // 2048
}

export type Image = {
  uuid: string
  versions: ImageVersions
  cdn: string
  path: string
  type: string
}

export interface Account {
  address: string
  ens?: string
  display: string
  tagline: string
  coverImage: Image
}

export interface SetSubmission {
  uuid: string
  name: string
  description?: string
  creator: string
  set_id?: number
  published_at: string | null
  approved_at: string | null
  starred_at: string | null
  shadowed_at: string | null
  reveals_at: string | null
  revealed_at?: string
  deleted_at?: string
  creatorAccount: Account
  submission_stats?: SubmissionStats
  edition_type: EditionType
  reveal_strategy: string
  reveal_block_number: string
  artist_signature?: ArtistSignature
  featured: number
  edition1Image: Image
  edition4Image: Image
  edition5Image: Image
  edition10Image: Image
  edition20Image: Image
  edition40Image: Image
  edition1Name: string
  edition4Name: string
  edition5Name: string
  edition10Name: string
  edition20Name: string
  edition40Name: string
}
