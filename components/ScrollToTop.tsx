'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Har sahifa (route) o'zgarganda sahifani tepadan ochadi
export default function ScrollToTop() {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
