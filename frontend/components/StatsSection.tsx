'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getUsersVisited, trackVisit } from '@/lib/api'

export default function StatsSection() {
  const [usersVisited, setUsersVisited] = useState(189)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAndTrack = async () => {
      try {
        // Track this visit
        await trackVisit()
        
        // Fetch total users visited
        const data = await getUsersVisited()
        setUsersVisited(data.count)
      } catch (error) {
        console.error('Error fetching users visited:', error)
        setUsersVisited(189)
      } finally {
        setLoading(false)
      }
    }
    
    // Small delay to prioritize projects loading
    const timeoutId = setTimeout(() => {
      fetchAndTrack()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k+`
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <div className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-1">
          {loading ? '...' : formatNumber(usersVisited)}
        </div>
        <div className="text-sm font-body text-gray-600 dark:text-gray-400 text-center max-w-xs md:max-w-sm">
          No. of people who already found their first contribution
        </div>
      </motion.div>
    </motion.div>
  )
}

