'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getStats } from '@/lib/api'

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCommits: 0,
    totalContributors: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Lazy load stats - only fetch when component is visible
    const fetchStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Use default values on error
        setStats({
          totalProjects: 0,
          totalCommits: 0,
          totalContributors: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    
    // Small delay to prioritize projects loading
    const timeoutId = setTimeout(() => {
      fetchStats()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k+`
    return num.toString()
  }

  const statsData = [
    { value: loading ? '...' : formatNumber(stats.totalProjects), label: 'Projects' },
    { value: loading ? '...' : formatNumber(stats.totalCommits), label: 'Commits' },
    { value: loading ? '...' : formatNumber(stats.totalContributors), label: 'Contributors' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-center justify-center gap-12 md:gap-16"
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </div>
          <div className="text-sm font-body text-gray-600 dark:text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

