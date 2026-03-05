import { useEffect, useRef, useState } from 'react'
import styles from './StreakBadge.module.css'

const MILESTONES = [3, 5, 10, 15, 20]

export default function StreakBadge({ streak, bestStreak, lastAnswerCorrect }) {
  const [bump, setBump]           = useState(false)
  const [burst, setBurst]         = useState(false)
  const [milestone, setMilestone] = useState(null)
  const prevStreak = useRef(0)

  useEffect(() => {
    if (streak > prevStreak.current && lastAnswerCorrect) {
      // Bump animation on every correct
      setBump(true)
      setTimeout(() => setBump(false), 400)

      // Milestone celebration
      if (MILESTONES.includes(streak)) {
        setMilestone(streak)
        setBurst(true)
        setTimeout(() => { setBurst(false); setMilestone(null) }, 2200)
      }
    }
    prevStreak.current = streak
  }, [streak, lastAnswerCorrect])

  if (streak === 0 && bestStreak === 0) return null

  const intensity =
    streak >= 10 ? 'inferno' :
    streak >= 5  ? 'blazing' :
    streak >= 3  ? 'hot'     : 'warm'

  return (
    <>
      {/* ── Milestone burst overlay ── */}
      {burst && milestone && (
        <div className={styles.burstOverlay}>
          <div className={styles.burstInner}>
            <div className={styles.burstFire}>🔥</div>
            <div className={styles.burstText}>{milestone} IN A ROW!</div>
            <div className={styles.burstSub}>
              {milestone >= 10 ? 'ABSOLUTELY ON FIRE' :
               milestone >= 5  ? 'YOU\'RE BLAZING' :
                                 'KEEP IT GOING'}
            </div>
            {/* Particle sparks */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={styles.spark}
                style={{
                  '--angle': `${(i / 12) * 360}deg`,
                  '--delay': `${i * 0.05}s`,
                  '--dist': `${60 + Math.random() * 40}px`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Streak badge ── */}
      <div className={`${styles.badge} ${styles[intensity]} ${bump ? styles.bump : ''}`}>
        <span className={styles.fire} aria-hidden="true">🔥</span>
        <span className={styles.count}>{streak}</span>
        {bestStreak > 3 && streak < bestStreak && (
          <span className={styles.best}>best {bestStreak}</span>
        )}
      </div>
    </>
  )
}