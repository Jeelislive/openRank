'use client'

import { motion } from 'framer-motion'
import { Star, GitFork } from 'lucide-react'

interface Project {
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

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const handleClick = () => {
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className="group relative border border-gray-200 dark:border-gray-800 rounded-lg p-6 card-hover cursor-pointer bg-white dark:bg-[#1a1a1f] hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
    >
      {/* Status Badge - Moved to top left to avoid overlap */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
          <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full" />
          <span className="text-xs text-green-700 dark:text-green-400 font-medium">{project.status}</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-4 pt-8">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 pr-2">
            {project.name}
          </h3>
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
            Rank #{project.rank}
          </span>
        </div>
        <p className="text-sm font-body text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {project.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2.5 py-1 text-xs font-body font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-body">
            <Star className="w-4 h-4" />
            <span className="text-sm">{project.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-body">
            <GitFork className="w-4 h-4" />
            <span className="text-sm">{project.forks.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{project.language}</span>
        </div>
      </div>
    </motion.div>
  )
}

