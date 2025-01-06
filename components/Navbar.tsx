"use client"

import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              DSA Analyzer
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/">
              Home
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/about">
              About
            </a>
            <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="/docs">
              Documentation
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

