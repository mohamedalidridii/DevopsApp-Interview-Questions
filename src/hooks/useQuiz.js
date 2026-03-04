import { useState, useCallback } from 'react'
import db from '../data/db.json'

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

export function useQuiz() {
  const [screen, setScreen]   = useState('home')   // 'home' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([])
  const [idx, setIdx]         = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [chosen, setChosen]   = useState(null)
  const [score, setScore]     = useState(0)
  const [wrong, setWrong]     = useState(0)
  const [skipped, setSkipped] = useState(0)

  const currentQ = questions[idx] ?? null
  const isLast   = idx + 1 >= questions.length
  const isCorrect = revealed && chosen === currentQ?.answer

  const start = useCallback(() => {
    setQuestions(shuffle(db.questions))
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
    if (isLast) {
      setScreen('result')
      return
    }
    setIdx((i) => i + 1)
    setRevealed(false)
    setChosen(null)
  }, [isLast])

  const skip = useCallback(() => {
    setSkipped((s) => s + 1)
    advance()
  }, [advance])

  const progress = questions.length
    ? Math.round(((idx + 1) / questions.length) * 100)
    : 0

  return {
    screen,
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
    progress,
    allQuestions: db.questions,
    start,
    pick,
    advance,
    skip,
  }
}
