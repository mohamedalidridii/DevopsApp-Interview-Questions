import { useState, useRef, useCallback, useEffect } from 'react'
import Badge from './Badge'
import { CAT_COLORS, DEFAULT_CAT, DIFFICULTY } from '../data/constants'
import styles from './CommandOrderCard.module.css'

// Fisher-Yates shuffle that guarantees a different order than the original
function shuffleAway(arr) {
  const original = arr.map((_, i) => i)
  let result
  let attempts = 0
  do {
    result = [...arr].sort(() => Math.random() - 0.5)
    attempts++
  } while (
    attempts < 20 &&
    result.every((item, i) => item === original[i])
  )
  return result
}

function buildShuffled(commands) {
  const indices = commands.map((_, i) => i)
  const shuffled = shuffleAway(indices)
  return shuffled.map(i => ({ id: i, text: commands[i] }))
}

// Check if current order matches correct order
function isCorrectOrder(items, correctOrder) {
  return items.every((item, pos) => item.id === correctOrder[pos])
}

// Score partial credit: how many are in correct position
function countCorrect(items, correctOrder) {
  return items.filter((item, pos) => item.id === correctOrder[pos]).length
}

export default function CommandOrderCard({
  question, idx, total,
  isLast, score, wrong, skipped,
  onAnswer, onAdvance, onSkip,
}) {
  const [items, setItems]       = useState(() => buildShuffled(question.commands))
  const [revealed, setRevealed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dragIdx, setDragIdx]   = useState(null)   // index being dragged
  const [overIdx, setOverIdx]   = useState(null)   // index being hovered over
  const [touchY, setTouchY]     = useState(null)
  const [touchItem, setTouchItem] = useState(null)
  const listRef = useRef(null)
  const itemRefs = useRef([])

  const cat  = CAT_COLORS[question.category] ?? DEFAULT_CAT
  const diff = DIFFICULTY[question.difficulty] ?? DIFFICULTY.medium

  const correct     = isCorrectOrder(items, question.order)
  const correctCount = submitted ? countCorrect(items, question.order) : 0

  // ── Mouse drag handlers ──────────────────────────────────────────────────
  const handleDragStart = (e, i) => {
    setDragIdx(i)
    e.dataTransfer.effectAllowed = 'move'
    // ghost image styling
    if (e.dataTransfer.setDragImage && itemRefs.current[i]) {
      e.dataTransfer.setDragImage(itemRefs.current[i], 20, 20)
    }
  }

  const handleDragOver = (e, i) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (i !== dragIdx) setOverIdx(i)
  }

  const handleDrop = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    reorder(dragIdx, i)
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    setOverIdx(null)
  }

  // ── Touch drag handlers ──────────────────────────────────────────────────
  const handleTouchStart = (e, i) => {
    if (revealed) return
    setTouchItem(i)
    setDragIdx(i)
    setTouchY(e.touches[0].clientY)
  }

  const handleTouchMove = (e) => {
    if (touchItem === null) return
    e.preventDefault()
    const y = e.touches[0].clientY
    setTouchY(y)

    // find which item we're hovering
    if (!listRef.current) return
    const children = [...listRef.current.children]
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect()
      if (y >= rect.top && y <= rect.bottom) {
        if (i !== touchItem) setOverIdx(i)
        break
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchItem !== null && overIdx !== null && overIdx !== touchItem) {
      reorder(touchItem, overIdx)
    }
    setTouchItem(null)
    setDragIdx(null)
    setOverIdx(null)
    setTouchY(null)
  }

  // ── Reorder logic ────────────────────────────────────────────────────────
  const reorder = useCallback((from, to) => {
    setItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  // ── Submit ───────────────────────────────────────────────────────────────
  const submit = () => {
    setSubmitted(true)
    setRevealed(true)
    onAnswer(isCorrectOrder(items, question.order))
  }

  // ── Item state class ─────────────────────────────────────────────────────
  const itemClass = (i) => {
    const base = styles.item
    if (!submitted) {
      if (i === dragIdx) return `${base} ${styles.dragging}`
      if (i === overIdx) return `${base} ${styles.over}`
      return base
    }
    const isRight = items[i].id === question.order[i]
    return `${base} ${isRight ? styles.itemCorrect : styles.itemWrong}`
  }

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Badge label={question.category} color={cat.c} bg={cat.bg} borderColor={cat.bd} />
        <Badge label="CMD · ORDER" color="#a78bfa" bg="rgba(167,139,250,0.08)" borderColor="rgba(167,139,250,0.3)" />
        <Badge label={diff.label} color={diff.color} bg={`${diff.color}15`} borderColor={`${diff.color}30`} />
        <span className={styles.qIdx}>Q{idx + 1}</span>
      </div>

      {/* ── Question ── */}
      <p className={styles.question}>{question.question}</p>

      {/* ── Hint ── */}
      {!submitted && (
        <p className={styles.hint}>
          ↕ Drag to reorder — place the commands in the correct sequence
        </p>
      )}

      {/* ── Draggable list ── */}
      <div
        className={styles.list}
        ref={listRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={el => itemRefs.current[i] = el}
            className={itemClass(i)}
            draggable={!submitted}
            onDragStart={e => handleDragStart(e, i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={e => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
            onTouchStart={e => handleTouchStart(e, i)}
          >
            {/* Step number */}
            <span className={styles.stepNum}>{i + 1}</span>

            {/* Command text */}
            <span className={styles.cmd}>{item.text}</span>

            {/* Result icon after submit */}
            {submitted && (
              <span className={styles.icon}>
                {items[i].id === question.order[i] ? '✓' : '✗'}
              </span>
            )}

            {/* Drag handle (hidden after submit) */}
            {!submitted && (
              <span className={styles.handle} aria-hidden="true">⠿</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Correct order reveal ── */}
      {submitted && !correct && (
        <div className={styles.correctOrder}>
          <div className={styles.correctOrderLabel}>// CORRECT ORDER</div>
          {question.order.map((cmdIdx, pos) => (
            <div key={pos} className={styles.correctItem}>
              <span className={styles.correctNum}>{pos + 1}</span>
              <span className={styles.correctCmd}>{question.commands[cmdIdx]}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Explanation ── */}
      {submitted && (
        <div className={`${styles.feedback} ${correct ? styles.ok : styles.bad}`}>
          <div className={styles.feedLabel}>
            {correct
              ? `✓ PERFECT ORDER — ${correctCount}/${items.length} correct`
              : `✗ ${correctCount}/${items.length} in correct position — EXPLANATION`}
          </div>
          {question.explanation}
        </div>
      )}

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.g}>{score}</span> correct &nbsp;·&nbsp;
          <span className={styles.r}>{wrong}</span> wrong &nbsp;·&nbsp;
          {skipped} skipped
        </div>
        <div className={styles.btns}>
          {!submitted && (
            <button className={`${styles.btn} ${styles.ghost}`} onClick={onSkip}>
              SKIP
            </button>
          )}
          {!submitted && (
            <button className={`${styles.btn} ${styles.submit}`} onClick={submit}>
              CHECK ORDER →
            </button>
          )}
          {submitted && (
            <button className={`${styles.btn} ${styles.next}`} onClick={onAdvance}>
              {isLast ? 'RESULTS' : 'NEXT'} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}