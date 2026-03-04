import Badge from './Badge'
import { CAT_COLORS, DEFAULT_CAT } from '../data/constants'
import styles from './HomeScreen.module.css'

export default function HomeScreen({ questions, onStart }) {
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

        <div className={styles.catGrid}>
          {categories.map((cat) => {
            const col = CAT_COLORS[cat] ?? DEFAULT_CAT
            return (
              <Badge
                key={cat}
                label={cat}
                color={col.c}
                bg={col.bg}
                borderColor={col.bd}
              />
            )
          })}
        </div>

        <button className={styles.startBtn} onClick={onStart}>
          BEGIN QUIZ
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  )
}
