'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'
import { AnimatePresence, motion } from 'framer-motion'

interface ComplexityGraphsProps {
  timeComplexity: string
  spaceComplexity: string
}

export default function ComplexityGraphs({ timeComplexity, spaceComplexity }: ComplexityGraphsProps) {
  const [data, setData] = useState<{ n: number; time: number; space: number }[]>([])

  useEffect(() => {
    const newData = []
    for (let n = 1; n <= 100; n++) {
      newData.push({
        n,
        time: calculateComplexity(n, timeComplexity),
        space: calculateComplexity(n, spaceComplexity),
      })
    }
    setData(newData)
  }, [timeComplexity, spaceComplexity])

  const calculateComplexity = (n: number, complexity: string) => {
    switch (complexity) {
      case 'O(1)':
        return 1
      case 'O(log n)':
        return Math.log(n)
      case 'O(n)':
        return n
      case 'O(n log n)':
        return n * Math.log(n)
      case 'O(n^2)':
        return n * n
      case 'O(2^n)':
        return Math.pow(2, n)
      default:
        return 0
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Complexity Visualization</CardTitle>
            <CardDescription>Visualize the time and space complexity of your code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium">Time Complexity: {timeComplexity}</p>
              <p className="text-sm font-medium">Space Complexity: {spaceComplexity}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="n" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#8884d8" name="Time Complexity" />
                <Line type="monotone" dataKey="space" stroke="#82ca9d" name="Space Complexity" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

