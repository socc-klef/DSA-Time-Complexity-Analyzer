'use client'

import { useState, useEffect } from 'react'
import CodeInput from './CodeInput'
import ComplexityAnalysis from './ComplexityAnalysis'
import ComplexityGraphs from './ComplexityGraphs'
import CodeDryRun from './CodeDryRun'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'sonner'
import { analyzeComplexity } from '../utils/complexityAnalyzer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DSAAnalyzer() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('')
  const [timeComplexity, setTimeComplexity] = useState('')
  const [spaceComplexity, setSpaceComplexity] = useState('')

  // Load from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('dsaLanguage') || 'javascript'
    const savedCode = localStorage.getItem(`dsaCode_${savedLanguage}`) || '// Your code here\n\n'

    setLanguage(savedLanguage)
    setCode(savedCode)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (language) {
      localStorage.setItem('dsaLanguage', language)
      localStorage.setItem(`dsaCode_${language}`, code)
      handleAnalyzeComplexity()
    }
  }, [code, language])

  const handleAnalyzeComplexity = () => {
    const { time, space } = analyzeComplexity(code, language)
    setTimeComplexity(time)
    setSpaceComplexity(space)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Code Input</CardTitle>
            <CardDescription>Enter your code and select the language</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeInput
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Complexity Analysis</TabsTrigger>
            <TabsTrigger value="visualization">Complexity Visualization</TabsTrigger>
            <TabsTrigger value="dryrun">Code Dry Run</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <ComplexityAnalysis
              timeComplexity={timeComplexity}
              spaceComplexity={spaceComplexity}
              onAnalyze={handleAnalyzeComplexity}
            />
          </TabsContent>
          <TabsContent value="visualization">
            <ComplexityGraphs timeComplexity={timeComplexity} spaceComplexity={spaceComplexity} />
          </TabsContent>
          <TabsContent value="dryrun">
            <CodeDryRun code={code} language={language} />
          </TabsContent>
        </Tabs>

        <Toaster />
      </motion.div>
    </AnimatePresence>
  )
}
