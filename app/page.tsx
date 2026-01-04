'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, ArrowRight, Github, Twitter, MessageCircle, ChevronUp, Loader2, Sparkles } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import FilterPanel from '@/components/FilterPanel'
import StatsSection from '@/components/StatsSection'
import ThemeToggle from '@/components/ThemeToggle'
import { getProjects, extractKeywords, type Project, type Filters } from '@/lib/api'
import { useAnimatedPlaceholder } from '@/hooks/useAnimatedPlaceholder'

const sortOptions = ['Rank', 'Stars', 'Forks', 'Recently Updated', 'Most Active']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [sortBy, setSortBy] = useState('Rank')
  const [activityFilter, setActivityFilter] = useState('All')
  const [minStars, setMinStars] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([])
  // Use static categories and languages (GitHub search doesn't need DB categories)
  const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'GameDev', 'Systems', 'Mobile', 'DevOps', 'Other']
  const languages = ['All', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart']
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Animated placeholder
  const animatedPlaceholder = useAnimatedPlaceholder()

  // Track if user has generated a search
  const [hasSearched, setHasSearched] = useState(false)
  const [activeSearchQuery, setActiveSearchQuery] = useState('')

  // Handle Generate button - extract keywords and trigger search
  const handleGenerate = async () => {
    if (!searchQuery.trim() || generating) return

    try {
      setGenerating(true)
      setError(null)
      
      // Extract keywords from natural language query (use in background, don't show)
      const result = await extractKeywords(searchQuery)
      
      // Keep original query in search bar, use extracted keywords for API search
      const finalQuery = result.searchQuery || searchQuery
      setActiveSearchQuery(finalQuery) // Use extracted keywords for search
      setHasSearched(true)
      
      // Trigger search immediately with extracted keywords
      try {
        setLoading(true)
        const filters: Filters = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          sortBy,
          minStars: minStars > 0 ? minStars : undefined,
          search: finalQuery || undefined,
        }
        const response = await getProjects(filters)
        setProjects(response.projects)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    } catch (err) {
      console.error('Error extracting keywords:', err)
      setError('Failed to extract keywords. Using original query.')
      // Fallback: use original query and trigger search
      setActiveSearchQuery(searchQuery)
      setHasSearched(true)
      
      // Trigger search with original query
      try {
        setLoading(true)
        const filters: Filters = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          sortBy,
          minStars: minStars > 0 ? minStars : undefined,
          search: searchQuery || undefined,
        }
        const response = await getProjects(filters)
        setProjects(response.projects)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    } finally {
      setGenerating(false)
    }
  }

  // Fetch projects when filters change (only if user has already generated a search)
  useEffect(() => {
    // Only refetch if user has already generated a search
    if (!hasSearched || !activeSearchQuery) {
      return
    }

    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const filters: Filters = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          language: selectedLanguage !== 'All' ? selectedLanguage : undefined,
          sortBy,
          minStars: minStars > 0 ? minStars : undefined,
          search: activeSearchQuery || undefined,
        }
        const response = await getProjects(filters)
        setProjects(response.projects)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [selectedCategory, selectedLanguage, sortBy, minStars, activeSearchQuery, hasSearched])

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcut for filters
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
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0f] sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">OpenRank</h1>
              <div className="hidden md:flex items-center gap-6">
                <button className="text-sm font-body text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Explorer</button>
                <button className="text-sm font-body text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Trending</button>
                <button className="text-sm font-body text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">AI Match</button>
                <button className="text-sm font-body text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">GitHub</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                New: AI-Powered Project Matching
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-all bg-white dark:bg-gray-900 shadow-sm relative">
                <div className="flex items-center gap-4 relative">
                  <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={isFocused ? "Type your search query..." : " "}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => {
                        // Only hide placeholder if there's no text
                        if (!searchQuery.trim()) {
                          setIsFocused(false)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          handleGenerate()
                        }
                      }}
                      className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none font-body"
                    />
                    {/* Animated placeholder overlay */}
                    {!isFocused && !searchQuery && (
                      <div className="absolute left-0 top-0 pointer-events-none flex items-center">
                        <span className="text-gray-600 dark:text-gray-300 font-signature text-lg font-medium">
                          {animatedPlaceholder}
                        </span>
                        <span className="ml-1 text-gray-600 dark:text-gray-300 animate-pulse font-signature text-lg">|</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      disabled={!searchQuery.trim() || generating}
                      className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate</span>
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

            {/* Quick Stats */}
            <StatsSection />
          </motion.div>
        </div>
      </section>

      {/* Filter Panel */}
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


      {/* Filter Tabs */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0f] sticky top-[73px] z-40 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <button className="py-4 text-sm font-heading font-medium text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white">
              Trending
            </button>
            <button className="py-4 text-sm font-heading font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Newly Added
            </button>
            <button className="py-4 text-sm font-heading font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              AI Pick
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-12">
        {/* Filter Tags */}
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <AnimatePresence mode="wait">
            {projects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query</p>
          </motion.div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20 bg-gray-50 dark:bg-[#0f0f1a] transition-colors">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-gray-900 dark:text-white">OpenRank</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-body">Built for the open source community.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2024 OpenRank. Built for the open source community.
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
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
    </main>
  )
}

