import { CAT_COLORS, DEFAULT_CAT } from '../data/constants'
import styles from './HomeScreen.module.css'

export default function HomeScreen({ questions, onEnter }) {
  const categories = [...new Set(questions.map((q) => q.category))]
  const hardCount  = questions.filter((q) => q.difficulty === 'hard').length

  return (
    <div className={styles.home}>
      <div className={styles.inner}>
        <p className={styles.prompt}>SENIOR DEVOPS · INTERVIEW QUIZ</p>

        <h1 className={styles.title}>
          ARE YOU<br />
          <em>SENIOR</em><br />
          ENOUGH?
        </h1>

        <p className={styles.sub}>
          Scenario-driven questions covering Kubernetes internals, IaC at scale,
          zero-trust security, distributed systems, GitOps, observability, and more.
          No theory — real engineering tradeoffs.
        </p>

        <div className={styles.stats}>
          {[
            [questions.length, 'QUESTIONS'],
            [hardCount,        'HARD'],
            [categories.length,'TOPICS'],
          ].map(([n, label]) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statNum}>{n}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        {/* Category dots preview */}
        <div className={styles.catDots}>
          {categories.map((cat) => {
            const col = CAT_COLORS[cat] ?? DEFAULT_CAT
            return (
              <span
                key={cat}
                className={styles.dot}
                title={cat}
                style={{ background: col.c }}
              />
            )
          })}
        </div>
        <p className={styles.catHint}>{categories.length} topics available — pick one or play all</p>

        <button className={styles.startBtn} onClick={onEnter}>
          CHOOSE CATEGORY
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  )
}