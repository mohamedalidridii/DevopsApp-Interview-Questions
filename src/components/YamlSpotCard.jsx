import { useState } from 'react'
import Badge from './Badge'
import YamlBlock from './YamlBlock'
import { CAT_COLORS, DEFAULT_CAT, DIFFICULTY } from '../data/constants'
import styles from './YamlSpotCard.module.css'

export default function YamlSpotCard({
  question, idx, total,
  isLast, score, wrong, skipped,
  onAnswer, onAdvance, onSkip,
}) {
  const [selectedLine, setSelectedLine] = useState(null)
  const [revealed,     setRevealed]     = useState(false)

  const cat  = CAT_COLORS[question.category] ?? DEFAULT_CAT
  const diff = DIFFICULTY[question.difficulty] ?? DIFFICULTY.medium
  const isCorrect = selectedLine === question.wrongLine

  const pickLine = (lineNum) => {
    if (revealed) return
    setSelectedLine(lineNum)
    setRevealed(true)
    onAnswer(lineNum === question.wrongLine)
  }

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Badge label={question.category} color={cat.c} bg={cat.bg} borderColor={cat.bd} />
        <Badge label="YAML · SPOT THE BUG" color="#f472b6" bg="rgba(244,114,182,0.08)" borderColor="rgba(244,114,182,0.25)" />
        <Badge label={diff.label} color={diff.color} bg={`${diff.color}15`} borderColor={`${diff.color}30`} />
        <span className={styles.qIdx}>Q{idx + 1}</span>
      </div>

      {/* ── Question ── */}
      <p className={styles.question}>{question.question}</p>

      {/* ── Hint ── */}
      {!revealed && (
        <p className={styles.hint}>
          {selectedLine
            ? `Line ${selectedLine} selected — click another to change, or proceed`
            : '↓ Click the line you think contains the bug'}
        </p>
      )}

      {/* ── YAML ── */}
      <div className={styles.yamlWrap}>
        <YamlBlock
          code={question.yaml}
          clickable
          selectedLine={selectedLine}
          correctLine={revealed ? question.wrongLine : null}
          revealed={revealed}
          onClickLine={pickLine}
        />
      </div>

      {/* ── Line feedback pills ── */}
      {revealed && (
        <div className={styles.lineFeedback}>
          {isCorrect ? (
            <div className={styles.correctPill}>
              ✓ Correct — line {question.wrongLine} is the bug
            </div>
          ) : (
            <div className={styles.wrongPill}>
              ✗ You picked line {selectedLine} — the bug is on line {question.wrongLine}
            </div>
          )}
        </div>
      )}

      {/* ── Explanation ── */}
      {revealed && (
        <div className={`${styles.feedback} ${isCorrect ? styles.ok : styles.bad}`}>
          <div className={styles.feedLabel}>EXPLANATION</div>
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
          {!revealed && selectedLine && (
            <button
              className={`${styles.btn} ${styles.submit}`}
              onClick={() => pickLine(selectedLine)}
            >
              SUBMIT LINE {selectedLine}
            </button>
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