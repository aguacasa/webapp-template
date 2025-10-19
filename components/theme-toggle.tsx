'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300" />
        )
      case 'dark':
        return (
          <Moon className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300" />
        )
      case 'system':
        return (
          <Monitor className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300" />
        )
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      case 'system':
        return 'Switch to light mode'
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={getLabel()}
      className="relative"
    >
      <div className="relative h-5 w-5">
        <div
          key={theme}
          className="absolute inset-0 flex items-center justify-center duration-300 animate-in fade-in zoom-in-50"
        >
          {getIcon()}
        </div>
      </div>
    </Button>
  )
}
