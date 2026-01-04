'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Github, Twitter, MessageCircle, ChevronUp, Loader2, Sparkles, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import FilterPanel from '@/components/FilterPanel'
import StatsSection from '@/components/StatsSection'
import ThemeToggle from '@/components/ThemeToggle'
import RepositoryModal from '@/components/RepositoryModal'
import { getProjects, extractKeywords, getNewlyAdded, type Project, type Filters } from '@/lib/api'
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
  const [error, setError] = useState<string | null>(null)
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
  const handleGenerate = async () => {
    if (!searchQuery.trim() || generating) return

    try {
      setGenerating(true)
        setError(null)
        const result = await extractKeywords(searchQuery)
        const finalQuery = result.searchQuery || searchQuery
        setActiveSearchQuery(finalQuery)
        setHasSearched(true)
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
          setActiveSearchQuery(searchQuery)
          setHasSearched(true)
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

  useEffect(() => {
    if (activeTab !== 'Home' || !hasSearched || !activeSearchQuery) {
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
  }, [selectedCategory, selectedLanguage, sortBy, minStars, activeSearchQuery, hasSearched, activeTab])

  useEffect(() => {
    if (activeTab === 'Newly Added') {
      const fetchNewlyAdded = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await getNewlyAdded(currentPage, itemsPerPage)
          setProjects(response.projects)
          setTotalPages(response.totalPages)
        } catch (err) {
          console.error('Error fetching newly added projects:', err)
          setError('Failed to load newly added projects')
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
      }
    }
  }, [activeTab, currentPage])

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
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-body bg-gray-900 dark:bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Coming soon
              </span>
            </button>
            <button 
              className="py-4 text-sm font-heading font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 relative group cursor-not-allowed"
              disabled
            >
              Ranking of Global Developers
              <Lock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-500" />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-body bg-gray-900 dark:bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Coming soon
              </span>
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

        {loading && activeTab === 'Newly Added' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-sm font-body text-gray-500 dark:text-gray-400">Loading newly added projects...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 gap-6 relative">
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

