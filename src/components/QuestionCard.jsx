import Badge from './Badge'
import { CAT_COLORS, DEFAULT_CAT, DIFFICULTY, LETTERS } from '../data/constants'
import styles from './QuestionCard.module.css'

export default function QuestionCard({
  question,
  idx,
  total,
  revealed,
  chosen,
  isCorrect,
  isLast,
  score,
  wrong,
  skipped,
  onPick,
  onAdvance,
  onSkip,
}) {
  const cat  = CAT_COLORS[question.category] ?? DEFAULT_CAT
  const diff = DIFFICULTY[question.difficulty] ?? DIFFICULTY.medium

  const optClass = (i) => {
    const base = styles.option
    if (!revealed) return base
    if (i === question.answer) return `${base} ${styles.correct}`
    if (i === chosen)          return `${base} ${styles.wrong}`
    return `${base} ${styles.dimmed}`
  }

  return (
    <div className={styles.card} key={question.id}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <Badge label={question.category} color={cat.c} bg={cat.bg} borderColor={cat.bd} />
        <Badge
          label={diff.label}
          color={diff.color}
          bg={`${diff.color}15`}
          borderColor={`${diff.color}30`}
        />
        <span className={styles.qIndex}>Q{idx + 1}</span>
      </div>

      {/* ── Question ── */}
      <p className={styles.questionText}>{question.question}</p>

      {/* ── Options ── */}
      <div className={styles.options}>
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={optClass(i)}
            disabled={revealed}
            onClick={() => onPick(i)}
          >
            <span className={styles.optKey}>{LETTERS[i]}</span>
            <span className={styles.optText}>{opt}</span>
          </button>
        ))}
      </div>

      {/* ── Explanation ── */}
      {revealed && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedCorrect : styles.feedWrong}`}>
          <div className={styles.feedLabel}>
            {isCorrect ? '✓ CORRECT' : '✗ INCORRECT — EXPLANATION'}
          </div>
          {question.explanation}
        </div>
      )}

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <div className={styles.footerStats}>
          <span className={styles.green}>{score}</span> correct &nbsp;·&nbsp;
          <span className={styles.red}>{wrong}</span> wrong &nbsp;·&nbsp;
          {skipped} skipped
        </div>
        <div className={styles.footerBtns}>
          {!revealed && (
            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onSkip}>
              SKIP
            </button>
          )}
          <button
            className={`${styles.btn} ${styles.btnNext}`}
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
