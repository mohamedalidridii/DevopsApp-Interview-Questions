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
  const [screen, setScreen]               = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)
  const [questions, setQuestions]         = useState([])
  const [idx, setIdx]                     = useState(0)
  const [revealed, setRevealed]           = useState(false)
  const [chosen, setChosen]               = useState(null)
  const [score, setScore]                 = useState(0)
  const [wrong, setWrong]                 = useState(0)
  const [skipped, setSkipped]             = useState(0)
  const [streak, setStreak]               = useState(0)
  const [bestStreak, setBestStreak]       = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null) // true|false|null

  const currentQ  = questions[idx] ?? null
  const isLast    = idx + 1 >= questions.length
  const isCorrect = revealed && chosen === currentQ?.answer

  const goToCategories = useCallback(() => setScreen('categories'), [])
  const goToHome       = useCallback(() => setScreen('home'), [])

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
    setStreak(0)
    setBestStreak(0)
    setLastAnswerCorrect(null)
    setRevealed(false)
    setChosen(null)
    setScreen('quiz')
  }, [])

  // Shared streak logic
  const _applyAnswer = useCallback((correct) => {
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
      setLastAnswerCorrect(true)
    } else {
      setWrong((w) => w + 1)
      setStreak(0)
      setLastAnswerCorrect(false)
    }
  }, [])

  const pick = useCallback((i) => {
    if (revealed) return
    setChosen(i)
    setRevealed(true)
    _applyAnswer(i === currentQ.answer)
  }, [revealed, currentQ, _applyAnswer])

  const registerAnswer = useCallback((correct) => {
    _applyAnswer(correct)
  }, [_applyAnswer])

  const advance = useCallback(() => {
    if (isLast) { setScreen('result'); return }
    setIdx((i) => i + 1)
    setRevealed(false)
    setChosen(null)
    setLastAnswerCorrect(null)
  }, [isLast])

  const skip = useCallback(() => {
    setSkipped((s) => s + 1)
    setStreak(0)
    setLastAnswerCorrect(null)
    advance()
  }, [advance])

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
    streak,
    bestStreak,
    lastAnswerCorrect,
    allQuestions: db.questions,
    goToCategories,
    goToHome,
    start,
    pick,
    registerAnswer,
    advance,
    skip,
    backToCategories,
  }
}