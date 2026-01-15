'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Github, Twitter, MessageCircle, ChevronUp, Loader2, Sparkles, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import ProjectCard from '@/components/ProjectCard'
import FilterPanel from '@/components/FilterPanel'
import StatsSection from '@/components/StatsSection'
import ThemeToggle from '@/components/ThemeToggle'
import RepositoryModal from '@/components/RepositoryModal'
import DeveloperCard from '@/components/DeveloperCard'
import { getProjects, extractKeywords, getNewlyAdded, type Project, type Filters } from '@/lib/api'
import { getDevelopersRanking, getAvailableCountries, getAvailableCities, getAvailableCompanies, getAvailableProfileTypes, checkDeveloperRank, type Developer } from '@/lib/developers-api'
import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder'

const sortOptions = ['Rank', 'Stars', 'Forks', 'Recently Updated', 'Most Active']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [sortBy, setSortBy] = useState('Rank')
  const [minStars, setMinStars] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  const [projects, setProjects] = useState<Project[]>([])
  const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'GameDev', 'Systems', 'Mobile', 'DevOps', 'Other']
  const languages = ['All', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart']
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'Home' | 'Newly Added' | 'AI Pick' | 'Ranking of Global Developers'>('Home')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const animatedPlaceholder = useAnimatedPlaceholder()
  const [hasSearched, setHasSearched] = useState(false)
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  
  // Cache for API responses - keyed by exact call parameters
  const apiCacheRef = useRef<Map<string, { projects: Project[], totalPages?: number }>>(new Map())
  
  // Developer Ranking State
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [developersLoading, setDevelopersLoading] = useState(false)
  const [developersPage, setDevelopersPage] = useState(1)
  const [developersTotalPages, setDevelopersTotalPages] = useState(1)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [selectedProfileType, setSelectedProfileType] = useState<string>('')
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([])
  const [availableProfileTypes, setAvailableProfileTypes] = useState<string[]>([])
  const [rankSearchQuery, setRankSearchQuery] = useState<string>('')
  const [rankSearchResult, setRankSearchResult] = useState<any>(null)
  const [rankSearchLoading, setRankSearchLoading] = useState(false)
  const [isProcessingProfile, setIsProcessingProfile] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const validateSearchQuery = (query: string): boolean => {
    const trimmed = query.trim()
    
    if (!trimmed) {
      toast.error('Search query cannot be empty')
      return false
    }
    
    if (trimmed.length < 3) {
      toast.error('Please enter at least 3 characters to search')
      return false
    }
    
    if (trimmed.length > 100) {
      toast.error('Search query is too long (max 100 characters)')
      return false
    }
    
    return true
  }

  const handleGenerate = async () => {
    const trimmedQuery = searchQuery.trim()
    
    if (!trimmedQuery || generating) return
    
    if (!validateSearchQuery(trimmedQuery)) {
      return
    }

    try {
      setGenerating(true)
      
      let finalQuery = trimmedQuery
      
      try {
        const result = await extractKeywords(trimmedQuery)
        finalQuery = result.searchQuery || trimmedQuery
      } catch (err) {
        console.error('Error extracting keywords:', err)
        finalQuery = trimmedQuery
      }

      setActiveSearchQuery(finalQuery)
      setHasSearched(true)

      try {
        const filters: Filters = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          sortBy,
          minStars: minStars > 0 ? minStars : undefined,
          search: finalQuery || undefined,
        }
        
        // Create cache key from filters
        const cacheKey = `home_${JSON.stringify(filters)}`
        
        // Check cache first
        const cached = apiCacheRef.current.get(cacheKey)
        if (cached) {
          setProjects(cached.projects)
          return
        }
        
        setLoading(true)
        const response = await getProjects(filters)
        
        if (!response.projects || response.projects.length === 0) {
          toast.info('No projects found', {
            description: 'Try adjusting your search or filters',
          })
        } else {
          toast.success(`Found ${response.projects.length} project${response.projects.length !== 1 ? 's' : ''}`)
        }
        
        setProjects(response.projects)
        
        // Store in cache
        apiCacheRef.current.set(cacheKey, { projects: response.projects })
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to fetch projects'
        
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
          toast.error('Network error', {
            description: 'Please check your internet connection and try again',
          })
        } else if (errorMessage.includes('rate limit') || errorMessage.includes('spam')) {
          toast.warning('Service temporarily unavailable', {
            description: 'GitHub API is rate-limited. Please try again in a few moments.',
          })
        } else {
          toast.error('Failed to load projects', {
            description: errorMessage,
          })
        }
        
        setProjects([])
      } finally {
        setLoading(false)
      }
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    // Only run when on Home tab with a search query
    if (activeTab !== 'Home' || !hasSearched || !activeSearchQuery) {
      return
    }

    const fetchProjects = async () => {
      try {
        const filters: Filters = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          sortBy,
          minStars: minStars > 0 ? minStars : undefined,
          search: activeSearchQuery || undefined,
        }
        
        // Create cache key from filters
        const cacheKey = `home_${JSON.stringify(filters)}`
        
        // Check cache first - if exists, use cached data and skip API call
        const cached = apiCacheRef.current.get(cacheKey)
        if (cached) {
          setProjects(cached.projects)
          return
        }
        
        // Cache miss - fetch from API
        setLoading(true)
        const response = await getProjects(filters)
        
        if (response.projects.length === 0) {
          toast.info('No projects found', {
            description: 'Try adjusting your filters or search query',
          })
        }
        
        setProjects(response.projects)
        
        // Store in cache for future use
        apiCacheRef.current.set(cacheKey, { projects: response.projects })
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to fetch projects'
        
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
          toast.error('Network error', {
            description: 'Please check your internet connection',
          })
        } else {
          toast.error('Failed to load projects', {
            description: errorMessage,
          })
        }
        
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [selectedCategory, selectedLanguage, sortBy, minStars, activeSearchQuery, hasSearched, activeTab])

  useEffect(() => {
    if (activeTab === 'Newly Added') {
      // Create cache key for newly added (page-based)
      const cacheKey = `newlyAdded_page_${currentPage}`
      
      // Check cache first
      const cached = apiCacheRef.current.get(cacheKey)
      if (cached && cached.totalPages !== undefined) {
        setProjects(cached.projects)
        setTotalPages(cached.totalPages)
        return
      }
      
      const fetchNewlyAdded = async () => {
        try {
          setLoading(true)
          const response = await getNewlyAdded(currentPage, itemsPerPage)
          setProjects(response.projects)
          setTotalPages(response.totalPages)
          
          // Store in cache
          apiCacheRef.current.set(cacheKey, { 
            projects: response.projects, 
            totalPages: response.totalPages 
          })
        } catch (err) {
          console.error('Error fetching newly added projects:', err)
          setProjects([])
        } finally {
          setLoading(false)
        }
      }
      fetchNewlyAdded()
    } else if (activeTab === 'Home') {
      if (!hasSearched) {
        setProjects([])
        setTotalPages(1)
      } else {
        // Restore cached Home data when switching back
        const filters: Filters = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          sortBy,
          minStars: minStars > 0 ? minStars : undefined,
          search: activeSearchQuery || undefined,
        }
        const cacheKey = `home_${JSON.stringify(filters)}`
        const cached = apiCacheRef.current.get(cacheKey)
        if (cached) {
          setProjects(cached.projects)
        }
      }
    }
  }, [activeTab, currentPage, hasSearched, activeSearchQuery, selectedCategory, selectedLanguage, sortBy, minStars])

  // Fetch developers ranking with auto-discovery (OPTIMIZED: Fast loading)
  useEffect(() => {
    if (activeTab === 'Ranking of Global Developers') {
      const fetchDevelopers = async () => {
        try {
          setDevelopersLoading(true)
          
          // Fetch immediately - backend returns cached data first
          // Only pass filters if they're not empty and not "All" options
          const response = await getDevelopersRanking(
            developersPage,
            25, // 25 per page
            selectedCountry && selectedCountry !== '' ? selectedCountry : undefined,
            selectedCity && selectedCity !== '' ? selectedCity : undefined,
            selectedCompany && selectedCompany !== '' ? selectedCompany : undefined,
            selectedProfileType && selectedProfileType !== '' ? selectedProfileType : undefined,
            true // Enable auto-discovery (runs in background)
          )
          
          setDevelopers(response.developers)
          setDevelopersTotalPages(response.totalPages)
          
          // If we got results, show success (even if background processing is happening)
          if (response.developers.length > 0) {
            // Silently update - no toast spam
            if (response.autoDiscovered && developersPage === 1) {
              toast.success(`Found ${response.developers.length} developers!`, {
                description: selectedCompany ? `From ${selectedCompany}` : 'Processing complete',
                duration: 3000,
              })
            }
          } else if (developersPage === 1) {
            // Show message if no results - might be discovering
            if (selectedCompany && selectedCompany !== '') {
              toast.info(`Fetching ${selectedCompany} developers...`, {
                description: 'Searching GitHub and processing profiles. This may take 30-60 seconds.',
                duration: 5000,
              })
            } else {
              toast.info('Discovering developers...', {
                description: 'This may take a moment. Refreshing in background.',
                duration: 3000,
              })
            }
          }
        } catch (err) {
          console.error('Error fetching developers:', err)
          toast.error('Failed to load developers ranking', {
            description: 'Please try again in a moment',
          })
          setDevelopers([])
        } finally {
          setDevelopersLoading(false)
        }
      }
      fetchDevelopers()
    }
  }, [activeTab, developersPage, selectedCountry, selectedCity, selectedCompany, selectedProfileType])

  // Handle rank search
  const handleRankSearch = async () => {
    if (!rankSearchQuery.trim()) return

    try {
      setRankSearchLoading(true)
      setIsProcessingProfile(false)
      const result = await checkDeveloperRank(
        rankSearchQuery.trim(),
        selectedCountry && selectedCountry !== '' ? selectedCountry : undefined,
        selectedCity && selectedCity !== '' ? selectedCity : undefined,
        selectedCompany && selectedCompany !== '' ? selectedCompany : undefined,
        selectedProfileType && selectedProfileType !== '' ? selectedProfileType : undefined
      )
      setRankSearchResult(result)
      
      if (!result.eligible) {
        toast.error('Not Eligible for Ranking', {
          description: result.message || 'You do not meet the eligibility criteria.',
          duration: 6000,
        })
        setIsProcessingProfile(false)
      } else if (result.processing) {
        setIsProcessingProfile(true)
        toast.info('Processing Profile', {
          description: 'We are processing your profile. This may take a few moments...',
          duration: 5000,
        })
        // Poll for completion
        pollForRankCompletion()
      } else if (result.rank === 0) {
        setIsProcessingProfile(false)
        toast.info('Not Found in Rankings', {
          description: result.message || 'Developer not found with current filters.',
          duration: 4000,
        })
      } else {
        setIsProcessingProfile(false)
        toast.success(`Rank found: #${result.rank} of ${result.total}`)
      }
    } catch (err: any) {
      console.error('Error checking rank:', err)
      toast.error(err.message || 'Failed to check rank')
      setRankSearchResult(null)
      setIsProcessingProfile(false)
    } finally {
      setRankSearchLoading(false)
    }
  }

  // Poll for rank completion when processing
  const pollForRankCompletion = async () => {
    if (!rankSearchQuery.trim()) return
    
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    
    let attempts = 0
    const maxAttempts = 30 // 30 attempts = 30 seconds (1 second intervals)
    
    pollingIntervalRef.current = setInterval(async () => {
      attempts++
      
      try {
        const result = await checkDeveloperRank(
          rankSearchQuery.trim(),
          selectedCountry && selectedCountry !== '' ? selectedCountry : undefined,
          selectedCity && selectedCity !== '' ? selectedCity : undefined,
          selectedCompany && selectedCompany !== '' ? selectedCompany : undefined,
          selectedProfileType && selectedProfileType !== '' ? selectedProfileType : undefined
        )
        
        if (!result.processing && result.rank > 0) {
          // Processing complete and rank found
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsProcessingProfile(false)
          setRankSearchResult(result)
          toast.success(`Rank found: #${result.rank} of ${result.total}`, {
            description: 'Profile processing completed!',
          })
        } else if (!result.processing && result.rank === 0) {
          // Processing complete but no rank (might have failed)
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsProcessingProfile(false)
          setRankSearchResult(result)
          toast.warning('Processing Complete', {
            description: result.message || 'Profile processed but not found in rankings.',
            duration: 4000,
          })
        } else if (attempts >= maxAttempts) {
          // Timeout
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsProcessingProfile(false)
          toast.error('Processing Timeout', {
            description: 'Processing is taking longer than expected. Please try again in a few moments.',
            duration: 5000,
          })
        }
      } catch (err) {
        console.error('Error polling for rank:', err)
        if (attempts >= maxAttempts) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsProcessingProfile(false)
        }
      }
    }, 1000) // Poll every 1 second
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [])

  // Fetch available filters
  useEffect(() => {
    if (activeTab === 'Ranking of Global Developers') {
      const fetchFilters = async () => {
        try {
          const [countries, companies, profileTypes] = await Promise.all([
            getAvailableCountries(),
            getAvailableCompanies(),
            getAvailableProfileTypes(),
          ])
          setAvailableCountries(countries)
          setAvailableCompanies(companies)
          setAvailableProfileTypes(profileTypes)
        } catch (err) {
          console.error('Error fetching filters:', err)
        }
      }
      fetchFilters()
    }
  }, [activeTab])

  // Fetch available cities when country changes
  useEffect(() => {
    if (activeTab === 'Ranking of Global Developers' && selectedCountry) {
      const fetchCities = async () => {
        try {
          const cities = await getAvailableCities(selectedCountry)
          setAvailableCities(cities)
        } catch (err) {
          console.error('Error fetching cities:', err)
          setAvailableCities([])
        }
      }
      fetchCities()
    } else {
      setAvailableCities([])
    }
  }, [activeTab, selectedCountry])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFilters(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0f] transition-colors">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0f] sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">OpenRank</h1>
              <div className="hidden md:flex items-center gap-6">
                <button 
                  className="text-sm font-body text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 relative group cursor-not-allowed"
                  disabled
                >
                  Explorer
                  <Lock className="w-3 h-3 text-gray-500 dark:text-gray-500" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-body bg-gray-900 dark:bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Coming soon
                  </span>
                </button>
                <button 
                  className="text-sm font-body text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 relative group cursor-not-allowed"
                  disabled
                >
                  Trending
                  <Lock className="w-3 h-3 text-gray-500 dark:text-gray-500" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-body bg-gray-900 dark:bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Coming soon
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                Find your first Contribution
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              Find your next<br />
              <span className="text-gray-600 dark:text-gray-400">Open Source</span><br />
              contribution.
            </h1>
            <p className="text-lg md:text-xl font-body text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              OpenRank helps you discover high-impact projects tailored to your skills.
              <br />
              <span className="text-gray-500 dark:text-gray-500">No login, no friction, just pure coding.</span>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12 px-2 sm:px-0"
            >
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-all bg-white dark:bg-gray-900 shadow-sm relative">
                <div className="flex items-center gap-2 sm:gap-4 relative">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="flex-1 relative min-w-0 overflow-hidden">
                    <input
                      type="text"
                      placeholder={isFocused ? "Type your search query..." : " "}
                      value={searchQuery}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 100) {
                          setSearchQuery(value)
                        }
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        if (!searchQuery.trim()) {
                          setIsFocused(false)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const trimmed = searchQuery.trim()
                          if (trimmed.length >= 3) {
                            handleGenerate()
                          } else if (trimmed.length > 0) {
                            toast.error('Please enter at least 3 characters to search')
                          } else {
                            toast.error('Search query cannot be empty')
                          }
                        }
                      }}
                      maxLength={100}
                      className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none font-body"
                    />
                    {!isFocused && !searchQuery && (
                      <div className="absolute left-0 top-0 pointer-events-none flex items-center w-full pr-2 overflow-hidden">
                        <span className="text-gray-600 dark:text-gray-300 font-signature text-sm sm:text-base md:text-lg font-medium truncate">
                          {animatedPlaceholder}
                        </span>
                        <span className="ml-1 text-gray-600 dark:text-gray-300 animate-pulse font-signature text-sm sm:text-base md:text-lg flex-shrink-0">|</span>
                      </div>
                    )}
                    {isFocused && searchQuery.length > 0 && (
                      <div className="absolute right-0 -bottom-5 text-xs text-gray-400 dark:text-gray-500">
                        {searchQuery.length < 3 ? (
                          <span className="text-yellow-600 dark:text-yellow-400">
                            {3 - searchQuery.length} more character{3 - searchQuery.length !== 1 ? 's' : ''} needed
                          </span>
                        ) : (
                          <span className={searchQuery.length > 90 ? 'text-red-500' : ''}>
                            {searchQuery.length}/100
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleGenerate}
                      disabled={!searchQuery.trim() || searchQuery.trim().length < 3 || generating}
                      className="px-3 sm:px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                          <span className="hidden sm:inline">Generating...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Generate</span>
                          <span className="sm:hidden">Go</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <StatsSection />
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showFilters && (
          <FilterPanel
            categories={categories}
            languages={languages}
            sortOptions={sortOptions}
            selectedCategory={selectedCategory}
            selectedLanguage={selectedLanguage}
            sortBy={sortBy}
            minStars={minStars}
            onCategoryChange={setSelectedCategory}
            onLanguageChange={setSelectedLanguage}
            onSortChange={setSortBy}
            onMinStarsChange={setMinStars}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>


      <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0f] sticky top-[73px] z-40 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setActiveTab('Home')
                setCurrentPage(1)
              }}
              className={`py-4 text-sm font-heading font-medium transition-colors ${
                activeTab === 'Home'
                  ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                setActiveTab('Newly Added')
                setCurrentPage(1)
              }}
              className={`py-4 text-sm font-heading font-medium transition-colors ${
                activeTab === 'Newly Added'
                  ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Newly Added
            </button>
            <button 
              className="py-4 text-sm font-heading font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 relative group cursor-not-allowed"
              disabled
            >
              AI Pick
              <Lock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-500" />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-body bg-gray-900 dark:bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Coming soon
              </span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('Ranking of Global Developers')
                setDevelopersPage(1)
              }}
              className={`py-4 text-sm font-heading font-medium transition-colors ${
                activeTab === 'Ranking of Global Developers'
                  ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ranking of Global Developers
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {selectedCategory !== 'All' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{selectedCategory}</span>
              <button onClick={() => setSelectedCategory('All')}>
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              </button>
            </motion.div>
          )}
          {selectedLanguage !== 'All' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{selectedLanguage}</span>
              <button onClick={() => setSelectedLanguage('All')}>
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              </button>
            </motion.div>
          )}
          {minStars > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Min {minStars.toLocaleString()} stars</span>
              <button onClick={() => setMinStars(0)}>
                <X className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Filters and Rank Search for Developers Ranking */}
        {activeTab === 'Ranking of Global Developers' && (
          <div className="space-y-4 mb-8">
            {/* Rank Search Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your GitHub username to check your rank..."
                  value={rankSearchQuery}
                  onChange={(e) => setRankSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && rankSearchQuery.trim()) {
                      handleRankSearch()
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <button
                onClick={handleRankSearch}
                disabled={!rankSearchQuery.trim() || rankSearchLoading}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {rankSearchLoading ? 'Checking...' : 'Check Rank'}
              </button>
            </div>

            {/* Rank Search Result */}
            {rankSearchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  rankSearchResult.processing
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                    : !rankSearchResult.eligible || rankSearchResult.rank === 0
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                {rankSearchResult.processing ? (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Processing {rankSearchResult.username}...
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {rankSearchResult.message || 'We are analyzing your GitHub profile and calculating your impact score. This may take a few moments.'}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Please wait, this usually takes 10-30 seconds...
                    </p>
                  </div>
                ) : !rankSearchResult.eligible || rankSearchResult.rank === 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚠️</span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {rankSearchResult.username}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {rankSearchResult.message}
                    </p>
                    {!rankSearchResult.eligible && (
                      <div className="mt-3 p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-xs text-orange-800 dark:text-orange-200">
                        <strong>Eligibility Criteria:</strong> You need to meet at least ONE of these in the last 90 days:
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>≥ 10 merged PRs to a public repo</li>
                          <li>≥ 2 issues closed (not self-created)</li>
                          <li>≥ 1 PR review accepted</li>
                          <li>Maintainer of an active repo</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {rankSearchResult.developer?.name || rankSearchResult.username}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Rank #{rankSearchResult.rank} of {rankSearchResult.total} developers
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {rankSearchResult.filters.country} {rankSearchResult.filters.city && `• ${rankSearchResult.filters.city}`}
                        {rankSearchResult.filters.company && `• ${rankSearchResult.filters.company}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {rankSearchResult.score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col">
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedCountry(value)
                    setSelectedCity('')
                    // Clear company filter when location is selected
                    if (value && value !== '') {
                      setSelectedCompany('')
                    }
                    setDevelopersPage(1)
                  }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!!(selectedCompany && selectedCompany !== '')}
                >
                  <option value="">All Locations</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {selectedCompany && selectedCompany !== '' && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Disabled when company is selected</span>
                )}
              </div>

              {selectedCountry && selectedCountry !== '' && (
                <div className="flex flex-col">
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value)
                      setDevelopersPage(1)
                    }}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!!(selectedCompany && selectedCompany !== '')}
                  >
                    <option value="">All Cities</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col">
                <select
                  value={selectedCompany}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedCompany(value)
                    // Clear location filters when company is selected
                    if (value && value !== '') {
                      setSelectedCountry('')
                      setSelectedCity('')
                    }
                    setDevelopersPage(1)
                  }}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!!((selectedCountry && selectedCountry !== '') || (selectedCity && selectedCity !== ''))}
                >
                  <option value="">All Companies</option>
                  {availableCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                {(selectedCountry && selectedCountry !== '') || (selectedCity && selectedCity !== '') ? (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Disabled when location is selected</span>
                ) : null}
              </div>

              <select
                value={selectedProfileType}
                onChange={(e) => {
                  setSelectedProfileType(e.target.value)
                  setDevelopersPage(1)
                }}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">All Profile Types</option>
                {availableProfileTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {(selectedCountry || selectedCity || selectedCompany || selectedProfileType) && (
                <button
                  onClick={() => {
                    setSelectedCountry('')
                    setSelectedCity('')
                    setSelectedCompany('')
                    setSelectedProfileType('')
                    setDevelopersPage(1)
                  }}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {loading && activeTab === 'Newly Added' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-sm font-body text-gray-500 dark:text-gray-400">Loading newly added projects...</p>
          </div>
        )}

        {developersLoading && activeTab === 'Ranking of Global Developers' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-sm font-body text-gray-500 dark:text-gray-400">Loading developers ranking...</p>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'Ranking of Global Developers' ? (
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {developers.map((developer, index) => (
                    <motion.div
                      key={developer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="w-full"
                    >
                      <DeveloperCard
                        developer={developer}
                        onCardClick={(username) => {
                          window.open(`https://github.com/${username}`, '_blank')
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {developers.length === 0 && !developersLoading && (
                  <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400">
                      No developers found. Try adjusting your filters or check back later.
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === 'Newly Added' ? (
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {projects?.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="w-full"
                    >
                      <ProjectCard 
                        project={project} 
                        variant="horizontal"
                        onCardClick={(fullName) => {
                          setSelectedRepo(fullName)
                          setIsModalOpen(true)
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                <AnimatePresence mode="wait">
                  {projects?.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <ProjectCard 
                        project={project} 
                        onCardClick={(fullName) => {
                          setSelectedRepo(fullName)
                          setIsModalOpen(true)
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}

        {loading && activeTab === 'Home' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-sm font-body text-gray-500 dark:text-gray-400">Searching projects...</p>
          </div>
        )}

        {projects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'Newly Added' ? 'No newly added projects found' : 'Try adjusting your filters or search query'}
            </p>
          </motion.div>
        )}

        {activeTab === 'Newly Added' && totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm font-body rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentPage === pageNum
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <span className="text-sm font-body text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'Ranking of Global Developers' && developersTotalPages > 1 && !developersLoading && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setDevelopersPage(prev => Math.max(1, prev - 1))}
              disabled={developersPage === 1 || developersLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, developersTotalPages) }, (_, i) => {
                let pageNum;
                if (developersTotalPages <= 5) {
                  pageNum = i + 1;
                } else if (developersPage <= 3) {
                  pageNum = i + 1;
                } else if (developersPage >= developersTotalPages - 2) {
                  pageNum = developersTotalPages - 4 + i;
                } else {
                  pageNum = developersPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setDevelopersPage(pageNum)}
                    disabled={developersLoading}
                    className={`px-3 py-2 text-sm font-body rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      developersPage === pageNum
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <span className="text-sm font-body text-gray-600 dark:text-gray-400">
              Page {developersPage} of {developersTotalPages} • Showing 25 per page
            </span>
            <button
              onClick={() => setDevelopersPage(prev => Math.min(developersTotalPages, prev + 1))}
              disabled={developersPage === developersTotalPages || developersLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20 bg-gray-50 dark:bg-[#0f0f1a] transition-colors">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-gray-900 dark:text-white">OpenRank</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-body">Built for the open source community.</p>
            </div>
            <div className="flex gap-6">
              <a 
                href="https://github.com/Jeelislive" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/rj_404_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://medium.com/@jeelrupareliya255" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Medium"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2024 OpenRank. Built for the open source community.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-3 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 rounded-full shadow-lg z-40 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <RepositoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedRepo(null)
        }}
        fullName={selectedRepo || ''}
      />
    </main>
  )
}

