import { useState, useEffect } from 'react'

const placeholders = [
  'i want to work in project where kafka is used',
  'show me repositories using react and typescript',
  'find open source projects with docker and kubernetes',
  'i need projects that use nestjs and postgresql',
]

export function useAnimatedPlaceholder() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    const currentPlaceholder = placeholders[currentIndex]
    let charIndex = 0
    let timeoutId: NodeJS.Timeout

    // Reset and start typing
    setDisplayText('')
    charIndex = 0

    const typeChar = () => {
      if (charIndex < currentPlaceholder.length) {
        setDisplayText(currentPlaceholder.slice(0, charIndex + 1))
        charIndex++
        timeoutId = setTimeout(typeChar, 50) // Typing speed: 50ms per character
      } else {
        // Finished typing, wait 3.5 seconds (as requested) before erasing
        timeoutId = setTimeout(() => {
          // Start erasing
          const eraseChar = () => {
            if (charIndex > 0) {
              setDisplayText(currentPlaceholder.slice(0, charIndex - 1))
              charIndex--
              timeoutId = setTimeout(eraseChar, 30) // Erasing speed: 30ms per character
            } else {
              // Finished erasing, move to next placeholder
              setCurrentIndex((prev) => (prev + 1) % placeholders.length)
            }
          }
          eraseChar()
        }, 3500) // Wait 3.5 seconds after typing completes
      }
    }

    typeChar()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [currentIndex])

  return displayText
}

