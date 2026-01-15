'use client'

import { motion } from 'framer-motion'
import { Github, MapPin, Trophy, GitBranch, GitCommit, GitPullRequest, MessageSquare, Code, Star, Users, Calendar, TrendingUp } from 'lucide-react'
import { Developer } from '@/lib/developers-api'
import Image from 'next/image'

interface DeveloperCardProps {
  developer: Developer
  onCardClick?: (username: string) => void
}

export default function DeveloperCard({ developer, onCardClick }: DeveloperCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getRankBadgeColor = (rank?: number) => {
    if (!rank) return 'bg-gray-500'
    if (rank === 1) return 'bg-yellow-500'
    if (rank === 2) return 'bg-gray-400'
    if (rank === 3) return 'bg-orange-500'
    if (rank <= 10) return 'bg-blue-500'
    if (rank <= 50) return 'bg-green-500'
    return 'bg-gray-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onCardClick?.(developer.githubUsername)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar and Rank */}
        <div className="relative flex-shrink-0">
          {developer.avatarUrl ? (
            <Image
              src={developer.avatarUrl}
              alt={developer.githubUsername}
              width={80}
              height={80}
              className="rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Github className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {developer.rank && (
            <div className={`absolute -top-2 -right-2 ${getRankBadgeColor(developer.rank)} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold`}>
              {developer.rank}
            </div>
          )}
        </div>

        {/* Developer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {developer.name || developer.githubUsername}
              </h3>
              <a
                href={developer.profileUrl || `https://github.com/${developer.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
              >
                <Github className="w-3 h-3" />
                {developer.githubUsername}
              </a>
            </div>
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              <Trophy className="w-4 h-4" />
              {Math.min(100, Number(developer.finalImpactScore || 0)).toFixed(1)}/100
            </div>
          </div>

          {developer.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {developer.bio}
            </p>
          )}

          {/* Location */}
          {(developer.country || developer.city) && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <MapPin className="w-4 h-4" />
              <span>
                {developer.city && developer.country 
                  ? `${developer.city}, ${developer.country}`
                  : developer.country || developer.city || developer.location}
              </span>
            </div>
          )}

          {/* Top Languages */}
          {developer.topLanguages && developer.topLanguages.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {developer.topLanguages.slice(0, 3).map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">PRs</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.totalPRs)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Commits</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.totalCommits)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Issues</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.totalIssues)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.followers)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Lines</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.totalLinesAdded)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Stars</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.totalStarsReceived)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Repos</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatNumber(developer.publicRepos)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Years</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {developer.yearsActive}
                </div>
              </div>
            </div>
          </div>

          {/* Impact Score Breakdown */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Impact Breakdown</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">PR Impact:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{Number(developer.prImpact || 0).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Issue Impact:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{Number(developer.issueImpact || 0).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Community:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{Number(developer.communityImpact || 0).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Longevity:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{Number(developer.projectLongevity || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
