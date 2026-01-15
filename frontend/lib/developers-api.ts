const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
  company: string | null
  profileType: string | null
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
  maxScore?: number
}

export async function getDevelopersRanking(
  page: number = 1,
  limit: number = 25,
  country?: string,
  city?: string,
  company?: string,
  profileType?: string,
  autoDiscover: boolean = true
): Promise<DevelopersRankingResponse & { autoDiscovered?: boolean }> {
  const queryParams = new URLSearchParams()
  queryParams.append('page', page.toString())
  queryParams.append('limit', limit.toString())
  if (country) queryParams.append('country', country)
  if (city) queryParams.append('city', city)
  if (company) queryParams.append('company', company)
  if (profileType) queryParams.append('profileType', profileType)
  queryParams.append('autoDiscover', autoDiscover.toString())

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

export async function triggerAutoDiscover(limit: number = 100): Promise<{ message: string, discovered: number, processed: number }> {
  const queryParams = new URLSearchParams()
  queryParams.append('limit', limit.toString())

  const response = await fetch(`${API_BASE_URL}/api/developers/auto-discover?${queryParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to trigger auto-discovery')
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

export async function getAvailableCompanies(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/developers/companies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }

  const data = await response.json()
  return data.companies || []
}

export async function getAvailableProfileTypes(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/developers/profile-types`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch profile types')
  }

  const data = await response.json()
  return data.profileTypes || []
}

export interface RankCheckResponse {
  username: string
  eligible: boolean
  processing?: boolean
  message?: string
  rank: number
  total: number
  score: number
  developer: Developer | null
  filters: {
    country: string
    city: string
    company: string
    profileType: string
  }
}

export async function checkDeveloperRank(
  username: string,
  country?: string,
  city?: string,
  company?: string,
  profileType?: string
): Promise<RankCheckResponse> {
  const queryParams = new URLSearchParams()
  if (country) queryParams.append('country', country)
  if (city) queryParams.append('city', city)
  if (company) queryParams.append('company', company)
  if (profileType) queryParams.append('profileType', profileType)

  const response = await fetch(`${API_BASE_URL}/api/developers/check-rank/${username}?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to check developer rank')
  }

  return response.json()
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
