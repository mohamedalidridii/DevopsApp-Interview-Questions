import { CAT_COLORS, DEFAULT_CAT } from '../data/constants'
import { ALL_CATEGORIES } from '../hooks/useQuiz'
import styles from './CategoryScreen.module.css'

export default function CategoryScreen({ allQuestions, onStart, onBack }) {
  const totalQ    = allQuestions.length
  const totalHard = allQuestions.filter((q) => q.difficulty === 'hard').length

  return (
    <div className={styles.wrap}>

      {/* ── Back ── */}
      <button className={styles.backBtn} onClick={onBack}>
        ← BACK
      </button>

      {/* ── Header ── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>SELECT MODE</p>
        <h2 className={styles.title}>Choose a Topic</h2>
        <p className={styles.sub}>
          Focus on one category or take on the full mixed quiz.
        </p>
      </div>

      {/* ── "All categories" card ── */}
      <button
        className={`${styles.card} ${styles.allCard}`}
        onClick={() => onStart(null)}
      >
        <div className={styles.cardLeft}>
          <div className={styles.allIcon}>∞</div>
          <div>
            <div className={styles.cardName}>All Categories</div>
            <div className={styles.cardMeta}>
              {totalQ} questions · {ALL_CATEGORIES.length} topics · {totalHard} hard
            </div>
          </div>
        </div>
        <span className={styles.cardArrow}>→</span>
      </button>

      {/* ── Divider ── */}
      <div className={styles.dividerRow}>
        <div className={styles.divLine} />
        <span className={styles.divLabel}>OR BY TOPIC</span>
        <div className={styles.divLine} />
      </div>

      {/* ── Category grid ── */}
      <div className={styles.grid}>
        {ALL_CATEGORIES.map(({ name, count, hard }) => {
          const col = CAT_COLORS[name] ?? DEFAULT_CAT
          return (
            <button
              key={name}
              className={styles.card}
              onClick={() => onStart(name)}
              style={{ '--cat-color': col.c, '--cat-bg': col.bg, '--cat-bd': col.bd }}
            >
              <div className={styles.cardAccent} style={{ background: col.c }} />
              <div className={styles.cardBody}>
                <div className={styles.cardName} style={{ color: col.c }}>{name}</div>
                <div className={styles.cardMeta}>
                  {count} question{count !== 1 ? 's' : ''}
                  {hard > 0 && <span className={styles.hardTag}> · {hard} hard</span>}
                </div>
              </div>
              <span className={styles.cardArrow} style={{ color: col.c }}>→</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}