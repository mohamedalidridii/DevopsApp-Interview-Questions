import styles from './RingChart.module.css'

export default function RingChart({ pct, score, total }) {
  const r    = 52
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className={styles.wrap}>
      <div className={styles.ring}>
        <svg
          width="130"
          height="130"
          className={styles.svg}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <circle
            cx="65" cy="65" r={r}
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          <circle
            cx="65" cy="65" r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.34,1.2,0.64,1)' }}
          />
        </svg>
        <div className={styles.inner}>
          <span className={styles.pct}>{pct}%</span>
          <span className={styles.frac}>{score}/{total}</span>
        </div>
      </div>
    </div>
  )
}
