import { useState } from 'react'
import Badge from './Badge'
import YamlBlock from './YamlBlock'
import { CAT_COLORS, DEFAULT_CAT, DIFFICULTY } from '../data/constants'
import styles from './YamlChoiceCard.module.css'

export default function YamlChoiceCard({
  question, idx, total,
  isLast, score, wrong, skipped,
  onAnswer, onAdvance, onSkip,
}) {
  const [chosen,   setChosen]   = useState(null)
  const [revealed, setRevealed] = useState(false)

  const cat  = CAT_COLORS[question.category] ?? DEFAULT_CAT
  const diff = DIFFICULTY[question.difficulty] ?? DIFFICULTY.medium
  const isCorrect = chosen === question.answer

  const choose = (i) => {
    if (revealed) return
    setChosen(i)
    setRevealed(true)
    onAnswer(i === question.answer)
  }

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Badge label={question.category} color={cat.c} bg={cat.bg} borderColor={cat.bd} />
        <Badge label="YAML · CHOICE" color="#38bdf8" bg="rgba(56,189,248,0.08)" borderColor="rgba(56,189,248,0.25)" />
        <Badge label={diff.label} color={diff.color} bg={`${diff.color}15`} borderColor={`${diff.color}30`} />
        <span className={styles.qIdx}>Q{idx + 1}</span>
      </div>

      {/* ── Question ── */}
      <p className={styles.question}>{question.question}</p>

      {/* ── YAML panels ── */}
      <div className={styles.panels}>
        {question.yamls.map((y, i) => (
          <YamlBlock
            key={i}
            code={y.code}
            label={y.label}
            choiceMode
            isAnswer={i === question.answer}
            isChosen={i === chosen}
            revealed={revealed}
            onChoose={() => choose(i)}
          />
        ))}
      </div>

      {/* ── Hint before reveal ── */}
      {!revealed && (
        <p className={styles.hint}>↑ Click the correct YAML block</p>
      )}

      {/* ── Explanation ── */}
      {revealed && (
        <div className={`${styles.feedback} ${isCorrect ? styles.ok : styles.bad}`}>
          <div className={styles.feedLabel}>
            {isCorrect ? '✓ CORRECT' : '✗ INCORRECT — EXPLANATION'}
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
          {!revealed && (
            <button className={`${styles.btn} ${styles.ghost}`} onClick={onSkip}>SKIP</button>
          )}
          <button
            className={`${styles.btn} ${styles.next}`}
            disabled={!revealed}
            onClick={onAdvance}
          >
            {isLast ? 'RESULTS' : 'NEXT'} →
          </button>
        </div>
      </div>
    </div>
  )
}