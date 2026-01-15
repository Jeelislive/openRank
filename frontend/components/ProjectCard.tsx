'use client'

import { motion } from 'framer-motion'
import { Star, GitFork, Calendar, Users } from 'lucide-react'

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
  variant?: 'default' | 'horizontal'
}

export default function ProjectCard({ project, onCardClick, variant = 'default' }: ProjectCardProps) {
  const handleClick = () => {
    if (project.fullName && onCardClick) {
      onCardClick(project.fullName)
    } else if (project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
    }
  }
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

  if (variant === 'horizontal') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={handleClick}
        className="group relative border border-gray-200 dark:border-gray-800 rounded-lg p-4 card-hover cursor-pointer bg-white dark:bg-[#1a1a1f] hover:border-gray-300 dark:hover:border-gray-700 transition-colors w-full"
      >
        <div className="flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 ${badgeStyles.bg} rounded border ${badgeStyles.border} flex-shrink-0`}>
                <div className={`w-1.5 h-1.5 ${badgeStyles.dot} rounded-full`} />
                <span className={`text-xs ${badgeStyles.text} font-medium`}>{project.status}</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate">
                {project.name}
              </h3>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
                #{project.rank}
              </span>
            </div>
            <p className="text-sm font-body text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {project.description}
            </p>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {project.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-body font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </span>
              ))}
              {project.category && project.category !== 'Other' && (
                <span className="px-2 py-0.5 text-xs font-body font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800">
                  {project.category}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400 font-body flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span className="font-semibold">{project.stars.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                <span className="font-semibold">{project.forks.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              {project.contributors > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.contributors}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{project.lastUpdated}</span>
              </div>
              {project.language && project.language !== 'Unknown' && (
                <div className="flex items-center gap-1">
                  <span className="font-mono">{project.language}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className="group relative border border-gray-200 dark:border-gray-800 rounded-lg p-4 card-hover cursor-pointer bg-white dark:bg-[#1a1a1f] hover:border-gray-300 dark:hover:border-gray-700 transition-colors h-full flex flex-col"
    >
      <div className="flex items-start gap-4 flex-1">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 ${badgeStyles.bg} rounded border ${badgeStyles.border} flex-shrink-0`}>
                <div className={`w-1.5 h-1.5 ${badgeStyles.dot} rounded-full`} />
                <span className={`text-xs ${badgeStyles.text} font-medium`}>{project.status}</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 line-clamp-1 truncate">
                {project.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 font-medium flex-shrink-0 ml-2">
              #{project.rank}
            </span>
          </div>
          <p className="text-sm font-body text-gray-600 dark:text-gray-400 line-clamp-1 mb-3">
            {project.description}
          </p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-body font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700"
              >
                {tag}
              </span>
            ))}
            {project.category && project.category !== 'Other' && (
              <span className="px-2 py-0.5 text-xs font-body font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800">
                {project.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 font-body mt-auto">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span>{project.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{project.forks.toLocaleString()}</span>
            </div>
            {project.contributors > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{project.contributors}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.lastUpdated}</span>
            </div>
            {project.language && project.language !== 'Unknown' && (
              <div className="flex items-center gap-1">
                <span className="font-mono text-gray-500 dark:text-gray-400">{project.language}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

