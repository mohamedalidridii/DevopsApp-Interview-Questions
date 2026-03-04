import styles from './ProgressBar.module.css'

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        <span>PROGRESS</span>
        <span>{current} / {total}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
