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
  onCardClick?: (fullName: string) => void
}

export default function ProjectCard({ project, onCardClick }: ProjectCardProps) {
  const handleClick = () => {
    if (project.fullName && onCardClick) {
      onCardClick(project.fullName)
    } else if (project.githubUrl) {
      // Fallback to opening GitHub if no modal handler
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Get badge styling based on activity level
  const getActivityBadgeStyles = (status: string) => {
    switch (status) {
      case 'Most Active':
        return {
          bg: 'bg-green-50 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-800',
          dot: 'bg-green-500 dark:bg-green-400',
          text: 'text-green-700 dark:text-green-400',
        }
      case 'Medium':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/30',
          border: 'border-yellow-200 dark:border-yellow-800',
          dot: 'bg-yellow-500 dark:bg-yellow-400',
          text: 'text-yellow-700 dark:text-yellow-400',
        }
      case 'Rare':
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          dot: 'bg-gray-400 dark:bg-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          dot: 'bg-gray-400 dark:bg-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
        }
    }
  }

  const badgeStyles = getActivityBadgeStyles(project.status)

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className="group relative border border-gray-200 dark:border-gray-800 rounded-lg p-6 card-hover cursor-pointer bg-white dark:bg-[#1a1a1f] hover:border-gray-300 dark:hover:border-gray-700 transition-colors h-full flex flex-col"
    >
      {/* Activity Badge - Moved to top left to avoid overlap */}
      <div className="absolute top-4 left-4">
        <div className={`flex items-center gap-1.5 px-2 py-1 ${badgeStyles.bg} rounded border ${badgeStyles.border}`}>
          <div className={`w-1.5 h-1.5 ${badgeStyles.dot} rounded-full`} />
          <span className={`text-xs ${badgeStyles.text} font-medium`}>{project.status}</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-4 pt-8 flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 pr-2 line-clamp-1">
            {project.name}
          </h3>
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
            Rank #{project.rank}
          </span>
        </div>
        <p className="text-sm font-body text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 overflow-hidden">
          {project.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
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
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto flex-shrink-0">
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

