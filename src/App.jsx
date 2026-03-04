import { useQuiz } from './hooks/useQuiz'
import HomeScreen   from './components/HomeScreen'
import QuestionCard from './components/QuestionCard'
import ResultScreen from './components/ResultScreen'
import ProgressBar  from './components/ProgressBar'
import styles from './App.module.css'

export default function App() {
  const quiz = useQuiz()

  return (
    <div className={styles.app}>
      {/* ── Scanline overlay ── */}
      <div className={styles.scanlines} aria-hidden="true" />

      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <div className={styles.logo}>
          Dev<em>Ops</em>.Quiz
        </div>
        {quiz.screen === 'quiz' && (
          <div className={styles.liveScore}>
            <strong>LIVE</strong> · {quiz.total} questions
          </div>
        )}
      </header>

      {/* ── Progress (quiz only) ── */}
      {quiz.screen === 'quiz' && (
        <ProgressBar current={quiz.idx + 1} total={quiz.total} />
      )}

      {/* ── Screens ── */}
      {quiz.screen === 'home' && (
        <HomeScreen
          questions={quiz.allQuestions}
          onStart={quiz.start}
        />
      )}

      {quiz.screen === 'quiz' && quiz.currentQ && (
        <QuestionCard
          key={quiz.currentQ.id}
          question={quiz.currentQ}
          idx={quiz.idx}
          total={quiz.total}
          revealed={quiz.revealed}
          chosen={quiz.chosen}
          isCorrect={quiz.isCorrect}
          isLast={quiz.isLast}
          score={quiz.score}
          wrong={quiz.wrong}
          skipped={quiz.skipped}
          onPick={quiz.pick}
          onAdvance={quiz.advance}
          onSkip={quiz.skip}
        />
      )}

      {quiz.screen === 'result' && (
        <ResultScreen
          score={quiz.score}
          wrong={quiz.wrong}
          skipped={quiz.skipped}
          total={quiz.total}
          onRestart={quiz.start}
        />
      )}
    </div>
  )
}
