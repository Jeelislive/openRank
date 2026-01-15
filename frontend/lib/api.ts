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

export async function trackVisit(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/stats/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Silently fail - don't block UI if tracking fails
    console.error('Failed to track visit:', error)
  }
}

export async function getUsersVisited(): Promise<{ count: number }> {
  const response = await fetch(`${API_BASE_URL}/api/stats/users-visited`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users visited count')
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

export interface NewlyAddedResponse {
  projects: Project[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getNewlyAdded(page: number = 1, limit: number = 10): Promise<NewlyAddedResponse> {
  const response = await fetch(`${API_BASE_URL}/api/projects/newly-added?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch newly added projects')
  }

  return response.json()
}

// Developer Ranking APIs
export interface Developer {
  id: number
  githubUsername: string
  name: string | null
  bio: string | null
  avatarUrl: string | null
  profileUrl: string | null
  prImpact: number
  issueImpact: number
  dependencyInfluence: number
  projectLongevity: number
  communityImpact: number
  docsImpact: number
  consistency: number
  qualityMultiplier: number
  finalImpactScore: number
  followers: number
  following: number
  publicRepos: number
  totalPRs: number
  totalCommits: number
  totalIssues: number
  totalLinesAdded: number
  totalLinesDeleted: number
  totalContributions: number
  totalStarsReceived: number
  totalForksReceived: number
  country: string | null
  city: string | null
  location: string | null
  topLanguages: string[]
  topRepositories: string[]
  activeProjects: number
  yearsActive: number
  githubCreatedAt: string | null
  lastActiveAt: string | null
  rank?: number
}

export interface DevelopersRankingResponse {
  developers: Developer[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getDevelopersRanking(
  page: number = 1,
  limit: number = 50,
  country?: string,
  city?: string
): Promise<DevelopersRankingResponse> {
  const queryParams = new URLSearchParams()
  queryParams.append('page', page.toString())
  queryParams.append('limit', limit.toString())
  if (country) queryParams.append('country', country)
  if (city) queryParams.append('city', city)

  const response = await fetch(`${API_BASE_URL}/api/developers/rankings?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch developers ranking')
  }

  return response.json()
}

export async function searchDevelopers(query: string, limit: number = 20): Promise<{ developers: Developer[], total: number }> {
  const queryParams = new URLSearchParams()
  queryParams.append('q', query)
  queryParams.append('limit', limit.toString())

  const response = await fetch(`${API_BASE_URL}/api/developers/search?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to search developers')
  }

  return response.json()
}

export async function getDeveloperByUsername(username: string): Promise<Developer> {
  const response = await fetch(`${API_BASE_URL}/api/developers/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch developer')
  }

  return response.json()
}

export async function getAvailableCountries(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/developers/countries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  const data = await response.json()
  return data.countries || []
}

export async function getAvailableCities(country: string): Promise<string[]> {
  const queryParams = new URLSearchParams()
  queryParams.append('country', country)

  const response = await fetch(`${API_BASE_URL}/api/developers/cities?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cities')
  }

  const data = await response.json()
  return data.cities || []
}

export async function calculateDeveloper(username: string): Promise<{ message: string, developer: Developer }> {
  const response = await fetch(`${API_BASE_URL}/api/developers/${username}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to calculate developer')
  }

  return response.json()
}
