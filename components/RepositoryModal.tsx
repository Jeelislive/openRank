'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, GitFork, Eye, AlertCircle, Calendar, Code, Users, Globe, ExternalLink, Github } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RepositoryDetails {
  repository: {
    id: number
    name: string
    fullName: string
    description: string
    url: string
    homepage: string | null
    stars: number
    forks: number
    watchers: number
    openIssues: number
    defaultBranch: string
    createdAt: string
    updatedAt: string
    pushedAt: string
    license: string
    topics: string[]
    archived: boolean
    disabled: boolean
  }
  owner: {
    login: string
    avatar: string
    url: string
    type: string
  }
  maintainers: Array<{
    login: string
    avatar: string
    url: string
  }>
  contributors: Array<{
    login: string
    avatar: string
    url: string
    contributions: number
  }>
  languages: Array<{
    name: string
    bytes: number
    percentage: string
  }>
}

interface RepositoryModalProps {
  isOpen: boolean
  onClose: () => void
  fullName: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function RepositoryModal({ isOpen, onClose, fullName }: RepositoryModalProps) {
  const [details, setDetails] = useState<RepositoryDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && fullName) {
      fetchRepositoryDetails()
    }
  }, [isOpen, fullName])

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      // Disable scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        // Re-enable scroll when modal closes
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        // Restore scroll position
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  const fetchRepositoryDetails = async () => {
    if (!fullName) return

    try {
      setLoading(true)
      setError(null)
      const [owner, repo] = fullName.split('/')
      const response = await fetch(`${API_BASE_URL}/api/projects/details/${owner}/${repo}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch repository details')
      }

      const data = await response.json()
      setDetails(data)
    } catch (err) {
      console.error('Error fetching repository details:', err)
      setError('Failed to load repository details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Repository Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
              </div>
            )}

            {details && !loading && (
              <div className="space-y-6">
                {/* Repository Header */}
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={details.owner.avatar}
                      alt={details.owner.login}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                        {details.repository.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-body mb-2">
                        {details.repository.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <a
                          href={details.owner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
                        >
                          <Users className="w-4 h-4" />
                          {details.owner.login}
                        </a>
                        <a
                          href={details.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Github className="w-4 h-4" />
                          View on GitHub
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {details.repository.homepage && (
                          <a
                            href={details.repository.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-4 h-4" />
                            Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-body">Stars</span>
                      </div>
                      <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        {details.repository.stars.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <GitFork className="w-4 h-4" />
                        <span className="text-sm font-body">Forks</span>
                      </div>
                      <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        {details.repository.forks.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-body">Watchers</span>
                      </div>
                      <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        {details.repository.watchers.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-body">Issues</span>
                      </div>
                      <p className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        {details.repository.openIssues.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                {details.languages.length > 0 && (
                  <div>
                    <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Languages
                    </h4>
                    <div className="space-y-2">
                      {details.languages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-body font-medium text-gray-900 dark:text-white">
                                {lang.name}
                              </span>
                              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {lang.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${lang.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributors */}
                {details.contributors.length > 0 && (
                  <div>
                    <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Top Contributors
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {details.contributors.map((contributor) => (
                        <a
                          key={contributor.login}
                          href={contributor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <img
                            src={contributor.avatar}
                            alt={contributor.login}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-body font-medium text-gray-900 dark:text-white truncate">
                              {contributor.login}
                            </p>
                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                              {contributor.contributions.toLocaleString()} commits
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics */}
                {details.repository.topics.length > 0 && (
                  <div>
                    <h4 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-3">
                      Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {details.repository.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1 text-sm font-body bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repository Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-body">Created: {formatDate(details.repository.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-body">Updated: {formatDate(details.repository.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-body">Last Push: {formatDate(details.repository.pushedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Code className="w-4 h-4" />
                    <span className="font-body">License: {details.repository.license}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Code className="w-4 h-4" />
                    <span className="font-body">Default Branch: {details.repository.defaultBranch}</span>
                  </div>
                  {details.repository.archived && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-body">Archived</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

