'use client'

import { motion } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'

interface FilterPanelProps {
  categories: string[]
  languages: string[]
  sortOptions: string[]
  selectedCategory: string
  selectedLanguage: string
  sortBy: string
  minStars: number
  onCategoryChange: (category: string) => void
  onLanguageChange: (language: string) => void
  onSortChange: (sort: string) => void
  onMinStarsChange: (stars: number) => void
  onApplyFilters: () => void
  onClose: () => void
}

export default function FilterPanel({
  categories,
  languages,
  sortOptions,
  selectedCategory,
  selectedLanguage,
  sortBy,
  minStars,
  onCategoryChange,
  onLanguageChange,
  onSortChange,
  onMinStarsChange,
  onApplyFilters,
  onClose,
}: FilterPanelProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto shadow-xl transition-colors"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="mb-8">
            <h3 className="text-xs font-heading font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3 py-1.5 rounded text-sm font-body font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xs font-heading font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Language
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => onLanguageChange(language)}
                  className={`px-3 py-1.5 rounded text-sm font-body font-medium transition-all ${
                    selectedLanguage === language
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xs font-heading font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Sort By
            </h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onSortChange(option)}
                  className={`w-full px-4 py-2.5 rounded text-left text-sm font-body font-medium transition-all ${
                    sortBy === option
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xs font-heading font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Minimum Stars
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={minStars}
                onChange={(e) => onMinStarsChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-900 dark:accent-white"
              />
              <div className="flex items-center justify-between text-sm font-body">
                <span className="text-gray-500 dark:text-gray-400 font-mono">0</span>
                <span className="text-gray-900 dark:text-white font-mono font-semibold">
                  {minStars.toLocaleString()} stars
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-mono">50k+</span>
              </div>
            </div>
          </div>
          
          {/* Apply Filters Button */}
          <button
            onClick={onApplyFilters}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl mb-3"
          >
            Apply Filters
          </button>
          
          <button
            onClick={() => {
              onCategoryChange('All')
              onLanguageChange('All')
              onSortChange('Rank')
              onMinStarsChange(0)
            }}
            className="w-full px-4 py-2.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-body font-medium border border-gray-200 dark:border-gray-700"
          >
            Reset All Filters
          </button>
        </div>
      </motion.div>
    </>
  )
}

