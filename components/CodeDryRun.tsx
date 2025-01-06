'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { Spinner } from '@/components/ui/spinner'

interface CodeDryRunProps {
  code: string
  language: string
}

const languageIds = {
  'javascript': 63,
  'python': 71,
  'java': 62,
  'cpp': 54
}

export default function CodeDryRun({ code, language }: CodeDryRunProps) {
  const [output, setOutput] = useState<string>('')
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')

    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ''
        },
        body: JSON.stringify({
          language_id: languageIds[language],
          source_code: code,
          stdin: input
        })
      });

      const { token } = await response.json();

      // Poll for results
      let result;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ''
          }
        });
        result = await statusResponse.json();
      } while (result.status.id <= 2);

      setOutput(result.stdout || result.stderr || 'No output');
    } catch (error) {
      setOutput('Error: Failed to execute code');
    } finally {
      setIsRunning(false)
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
            <CardTitle>Code Dry Run</CardTitle>
            <CardDescription>Run your code and see the output</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button onClick={runCode} disabled={isRunning}>
                {isRunning ? <Spinner /> : 'Run Code'}
              </Button>
            </div>
            <div>
              <Input
                type="text"
                placeholder="Enter input (optional)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

