import RingChart from './RingChart'
import styles from './ResultScreen.module.css'

function getGrade(pct) {
  if (pct >= 90) return { title: 'ELITE',       sub: 'Top-tier senior engineering judgement.' }
  if (pct >= 75) return { title: 'SENIOR',       sub: 'Solid depth. Ready for senior-level interviews.' }
  if (pct >= 55) return { title: 'MID-LEVEL',    sub: 'Good foundations — sharpen the hard topics.' }
  return              { title: 'KEEP\nGRINDING', sub: 'Study the explanations and retry.' }
}

export default function ResultScreen({
  score, wrong, skipped, total,
  category,   // null = "All"
  onRestart,  // retry same category
  onChangeCategory,
}) {
  const pct   = Math.round((score / total) * 100)
  const grade = getGrade(pct)

  return (
    <div className={styles.result}>

      <div className={styles.topRow}>
        <div className={styles.catPill}>
          {category ? `// ${category}` : '// All Categories'}
        </div>
      </div>

      <div className={styles.grade}>{grade.title}</div>
      <div className={styles.sub}>{grade.sub}</div>
      <p className={styles.label}>QUIZ COMPLETE · {total} QUESTIONS</p>

      <RingChart pct={pct} score={score} total={total} />

      <div className={styles.stats}>
        {[
          { n: score,   color: '#34d399', label: 'CORRECT'  },
          { n: wrong,   color: '#f87171', label: 'WRONG'    },
          { n: skipped, color: '#fbbf24', label: 'SKIPPED'  },
        ].map(({ n, color, label }) => (
          <div key={label} className={styles.statBox}>
            <div className={styles.statNum} style={{ color }}>{n}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.retryBtn} onClick={onRestart}>
          ↺ RETRY {category ? category.toUpperCase() : 'ALL'}
        </button>
        <button className={styles.changeBtn} onClick={onChangeCategory}>
          CHANGE TOPIC →
        </button>
      </div>
    </div>
  )
}