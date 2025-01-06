'use client'

import { useState, useCallback, useEffect } from 'react'
import { Resizable } from 're-resizable'
import { Editor, OnMount } from '@monaco-editor/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AnimatePresence, motion } from 'framer-motion'

interface CodeInputProps {
  code: string
  setCode: (code: string) => void
  language: string
  setLanguage: (language: string) => void
}

export default function CodeInput({ code, setCode, language, setLanguage }: CodeInputProps) {
  const [height, setHeight] = useState(400)

  const handleEditorDidMount: OnMount = useCallback(
    (editor) => {
      editor.updateOptions({
        tabSize: language === 'python' ? 4 : 2,
        insertSpaces: true,
        detectIndentation: false,
      })
    },
    [language]
  )

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    const defaultCode =
      newLanguage === 'python' ? '# Your Python code here\n\n' : '// Your code here\n\n'
    setCode(defaultCode)
  }

  useEffect(() => {
    if (!language) {
      setLanguage('javascript')
      setCode('// Your code here\n\n')
    }
  }, [language, setCode, setLanguage])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
        <Resizable
          size={{ width: '100%', height }}
          onResizeStop={(e, direction, ref, d) => {
            setHeight(height + d.height)
          }}
        >
          <Editor
            height={`${height}px`}
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: language === 'python' ? 4 : 2,
              insertSpaces: true,
              detectIndentation: false,
            }}
            onMount={handleEditorDidMount}
          />
        </Resizable>
      </motion.div>
    </AnimatePresence>
  )
}
