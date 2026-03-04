import { useQuiz } from './hooks/useQuiz'
import HomeScreen     from './components/HomeScreen'
import CategoryScreen from './components/CategoryScreen'
import QuestionCard   from './components/QuestionCard'
import ResultScreen   from './components/ResultScreen'
import ProgressBar    from './components/ProgressBar'
import styles from './App.module.css'

export default function App() {
  const quiz = useQuiz()

  return (
    <div className={styles.app}>
      {/* ── Scanline overlay ── */}
      <div className={styles.scanlines} aria-hidden="true" />

      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <button
          className={styles.logo}
          onClick={() => quiz.screen !== 'home' && quiz.goToHome()}
          style={{ cursor: quiz.screen !== 'home' ? 'pointer' : 'default', background: 'none', border: 'none' }}
        >
          Dev<em>Ops</em>.medaly
        </button>

        {quiz.screen === 'quiz' && (
          <div className={styles.liveScore}>
            <strong>{quiz.activeCategory ?? 'ALL'}</strong>
            &nbsp;·&nbsp;{quiz.idx + 1}/{quiz.total}
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
          onEnter={quiz.goToCategories}
        />
      )}

      {quiz.screen === 'categories' && (
        <CategoryScreen
          allQuestions={quiz.allQuestions}
          onStart={quiz.start}
              onBack={quiz.goToHome}
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
          onAnswer={quiz.registerAnswer}
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
          category={quiz.activeCategory}
          onRestart={() => quiz.start(quiz.activeCategory)}
          onChangeCategory={quiz.backToCategories}
        />
      )}
    </div>
  )
}