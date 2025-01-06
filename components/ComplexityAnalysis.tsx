'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'

interface ComplexityAnalysisProps {
  timeComplexity: string
  spaceComplexity: string
  onAnalyze: () => void
}

export default function ComplexityAnalysis({
  timeComplexity,
  spaceComplexity,
  onAnalyze,
}: ComplexityAnalysisProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Complexity Analysis</CardTitle>
            <CardDescription>Analyze the time and space complexity of your code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Time Complexity:</p>
                <p className="text-2xl font-bold">{timeComplexity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Space Complexity:</p>
                <p className="text-2xl font-bold">{spaceComplexity || 'N/A'}</p>
              </div>
            </div>
            <Button onClick={onAnalyze} className="w-full">
              Analyze Complexity
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

