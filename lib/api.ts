const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface Project {
  id: number
  name: string
  description: string
  rank: number
  tags: string[]
  stars: number
  forks: number
  status: string
  language: string
  category: string
  lastUpdated: string
  contributors: number
  githubUrl?: string
  fullName?: string
}

export interface ProjectsResponse {
  projects: Project[]
  total: number
}

export interface StatsResponse {
  totalProjects: number
  totalCommits: number
  totalContributors: number
}

export interface Filters {
  category?: string
  language?: string
  sortBy?: string
  minStars?: number
  search?: string
}

export async function getProjects(filters: Filters = {}): Promise<ProjectsResponse> {
  const queryParams = new URLSearchParams()
  
  if (filters.category && filters.category !== 'All') {
    queryParams.append('category', filters.category)
  }
  if (filters.language && filters.language !== 'All') {
    queryParams.append('language', filters.language)
  }
  if (filters.sortBy) {
    queryParams.append('sortBy', filters.sortBy)
  }
  if (filters.minStars) {
    queryParams.append('minStars', filters.minStars.toString())
  }
  if (filters.search) {
    queryParams.append('search', filters.search)
  }

  const response = await fetch(`${API_BASE_URL}/api/projects?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}

export async function getStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }

  return response.json()
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

export async function getLanguages(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/languages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch languages')
  }

  return response.json()
}

export interface KeywordExtractionResponse {
  keywords: string[]
  searchQuery: string
}

export async function extractKeywords(query: string): Promise<KeywordExtractionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/projects/extract-keywords`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error('Failed to extract keywords')
  }

  return response.json()
}

