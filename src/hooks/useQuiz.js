import { useState, useCallback } from 'react'
import db from '../data/db.json'

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// Derive all categories + per-category metadata from db
export const ALL_CATEGORIES = (() => {
  const map = {}
  db.questions.forEach((q) => {
    if (!map[q.category]) {
      map[q.category] = { name: q.category, count: 0, hard: 0 }
    }
    map[q.category].count++
    if (q.difficulty === 'hard') map[q.category].hard++
  })
  return Object.values(map)
})()

export function useQuiz() {
  // screens: 'home' | 'categories' | 'quiz' | 'result'
  const [screen, setScreen]         = useState('home')
  const [activeCategory, setActiveCategory] = useState(null) // null = All
  const [questions, setQuestions]   = useState([])
  const [idx, setIdx]               = useState(0)
  const [revealed, setRevealed]     = useState(false)
  const [chosen, setChosen]         = useState(null)
  const [score, setScore]           = useState(0)
  const [wrong, setWrong]           = useState(0)
  const [skipped, setSkipped]       = useState(0)

  const currentQ  = questions[idx] ?? null
  const isLast    = idx + 1 >= questions.length
  const isCorrect = revealed && chosen === currentQ?.answer

  // Go to category picker
  const goToCategories = useCallback(() => setScreen('categories'), [])

  // Go back to home
  const goToHome = useCallback(() => setScreen('home'), [])

  // Start quiz — category=null means "All"
  const start = useCallback((category = null) => {
    const pool = category
      ? db.questions.filter((q) => q.category === category)
      : db.questions
    setActiveCategory(category)
    setQuestions(shuffle(pool))
    setIdx(0)
    setScore(0)
    setWrong(0)
    setSkipped(0)
    setRevealed(false)
    setChosen(null)
    setScreen('quiz')
  }, [])

  const pick = useCallback((i) => {
    if (revealed) return
    setChosen(i)
    setRevealed(true)
    if (i === currentQ.answer) setScore((s) => s + 1)
    else setWrong((w) => w + 1)
  }, [revealed, currentQ])

  const advance = useCallback(() => {
    if (isLast) { setScreen('result'); return }
    setIdx((i) => i + 1)
    setRevealed(false)
    setChosen(null)
  }, [isLast])

  const skip = useCallback(() => {
    setSkipped((s) => s + 1)
    advance()
  }, [advance])

  // From result: go back to category picker (not home)
  const backToCategories = useCallback(() => setScreen('categories'), [])

  return {
    screen,
    activeCategory,
    currentQ,
    idx,
    total: questions.length,
    revealed,
    chosen,
    isCorrect,
    isLast,
    score,
    wrong,
    skipped,
    allQuestions: db.questions,
    goToCategories,
    goToHome,
    start,
    pick,
    advance,
    skip,
    backToCategories,
  }
}