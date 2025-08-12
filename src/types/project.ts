export type Project = {
  id: number
  name: string
  slug: string
  description: string | null
  url: string | null
  repo: string | null
  featured: boolean
  tags: string[]
}

