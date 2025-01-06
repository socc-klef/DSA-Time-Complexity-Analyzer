'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const cardTransition = {
    duration: 0.5,
    ease: 'easeInOut',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto p-6 space-y-6"
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...cardTransition, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>About DSA Analyzer</CardTitle>
            <CardDescription>
              A powerful tool for analyzing and understanding the computational complexities of your
              code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The DSA Analyzer simplifies algorithm analysis by offering instant feedback on time
              and space complexities, enabling code optimization for learners and professionals.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...cardTransition, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Code Input:</strong> Write or paste code in multiple programming languages.
              </li>
              <li>
                <strong>Complexity Analysis:</strong> Instantly analyze time and space complexities.
              </li>
              <li>
                <strong>Visualization:</strong> View interactive graphs for performance insights.
              </li>
              <li>
                <strong>Dry Run:</strong> Step through code execution for deeper understanding.
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...cardTransition, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select your preferred programming language.</li>
              <li>Paste or write your code in the editor.</li>
              <li>Analyze, visualize, or dry-run your code via the provided tabs.</li>
              <li>
                Save your progress, and revisit your work anytime with persistent local storage.
              </li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...cardTransition, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Frontend:</strong> React and Tailwind CSS for a responsive experience.
              </li>
              <li>
                <strong>Animations:</strong> Framer Motion for smooth transitions.
              </li>
              <li>
                <strong>Storage:</strong> LocalStorage for saving code and language preferences.
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ ...cardTransition, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              For feedback, issues, or suggestions, please reach out to us at{' '}
              <a href="mailto:email@example.com" className="text-blue-500 hover:underline">
                email@example.com
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
