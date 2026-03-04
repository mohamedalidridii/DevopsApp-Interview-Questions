import styles from './Badge.module.css'

export default function Badge({ label, color, bg, borderColor }) {
  return (
    <span
      className={styles.badge}
      style={{ color, background: bg, borderColor }}
    >
      {label}
    </span>
  )
}
