'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Code2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Project {
  id: number
  name: string
  description: string
  tags: string[]
}

interface SearchModalProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onClose: () => void
  projects: Project[]
}

export default function SearchModal({
  searchQuery,
  onSearchChange,
  onClose,
  projects,
}: SearchModalProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(localQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(localQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(localQuery.toLowerCase()))
  ).slice(0, 5)

  useEffect(() => {
    onSearchChange(localQuery)
  }, [localQuery, onSearchChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredProjects.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filteredProjects[selectedIndex]) {
        // Handle selection
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredProjects, selectedIndex, onClose])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search projects..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 transition-colors"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {localQuery && filteredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={onClose}
                    className={`p-4 rounded-lg cursor-pointer transition-all border ${
                      index === selectedIndex
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                        : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Code2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <h3 className="font-heading font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                        </div>
                        <p className="text-sm font-body text-gray-600 dark:text-gray-400 line-clamp-1">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-0.5 text-xs font-body bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {localQuery && filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No projects found</p>
              </motion.div>
            )}

            {!localQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <kbd className="px-3 py-1.5 text-sm font-mono font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                      ⌘K
                    </kbd>
                    <span>to open search</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Start typing to search projects...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

