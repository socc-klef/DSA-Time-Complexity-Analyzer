import { Metadata } from 'next'
import DSAAnalyzer from '@/components/DSAAnalyzer'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'DSA Analyzer',
  description: 'Analyze time and space complexity of your code',
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">DSA Analyzer</h1>
        <DSAAnalyzer />
      </main>
    </div>
  )
}

