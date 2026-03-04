import styles from './YamlBlock.module.css'

// Very lightweight YAML token colorizer
function tokenizeLine(line) {
  if (!line.trim()) return [{ type: 'plain', text: line }]

  const tokens = []

  // Comment
  if (line.trim().startsWith('#')) {
    return [{ type: 'comment', text: line }]
  }

  // Key: value   or   - key: value
  const keyValMatch = line.match(/^(\s*-?\s*)([a-zA-Z_][a-zA-Z0-9_-]*)(\s*:\s*)(.*)$/)
  if (keyValMatch) {
    const [, indent, key, colon, rest] = keyValMatch
    tokens.push({ type: 'plain',  text: indent })
    tokens.push({ type: 'key',    text: key })
    tokens.push({ type: 'plain',  text: colon })
    if (rest !== '') tokens.push(tokenizeValue(rest))
    return tokens
  }

  // List item (- value)
  const listMatch = line.match(/^(\s*)(-)(\s+)(.+)$/)
  if (listMatch) {
    const [, indent, dash, sp, val] = listMatch
    tokens.push({ type: 'plain', text: indent })
    tokens.push({ type: 'dash',  text: dash })
    tokens.push({ type: 'plain', text: sp })
    tokens.push(tokenizeValue(val))
    return tokens
  }

  return [{ type: 'plain', text: line }]
}

function tokenizeValue(val) {
  const v = val.trim()
  if (v === 'true' || v === 'false' || v === 'null') return { type: 'bool', text: val }
  if (/^-?\d+(\.\d+)?$/.test(v))  return { type: 'number', text: val }
  if (v.startsWith('"') || v.startsWith("'")) return { type: 'string', text: val }
  if (v.startsWith('|') || v.startsWith('>')) return { type: 'special', text: val }
  return { type: 'value', text: val }
}

const TOKEN_COLORS = {
  key:     '#93c5fd',   // blue
  value:   '#d1d5db',   // light grey
  string:  '#86efac',   // green
  number:  '#fbbf24',   // amber
  bool:    '#f472b6',   // pink
  dash:    '#94a3b8',   // slate
  comment: '#475569',   // muted
  special: '#a78bfa',   // purple
  plain:   '#cbd5e1',   // default
}

/**
 * Props:
 *  code         string  — raw YAML text
 *  label        string  — optional header label
 *  clickable    bool    — enable line clicking (spot-the-bug mode)
 *  selectedLine number  — 1-based line user clicked
 *  correctLine  number  — 1-based correct wrong line (shown after reveal)
 *  revealed     bool
 *  onClickLine  fn(lineNumber)
 *  isAnswer     bool    — this block is the correct answer (yaml-choice)
 *  isChosen     bool    — user chose this block
 *  choiceMode   bool    — yaml-choice mode (whole-block selection)
 */
export default function YamlBlock({
  code,
  label,
  clickable = false,
  selectedLine = null,
  correctLine = null,
  revealed = false,
  onClickLine,
  isAnswer = false,
  isChosen = false,
  choiceMode = false,
  onChoose,
}) {
  const lines = code.split('\n')

  const blockClass = [
    styles.block,
    choiceMode && styles.choiceBlock,
    choiceMode && isChosen && !revealed && styles.chosenBlock,
    choiceMode && revealed && isAnswer  && styles.correctBlock,
    choiceMode && revealed && isChosen && !isAnswer && styles.wrongBlock,
  ].filter(Boolean).join(' ')

  const lineClass = (i) => {
    const lineNum = i + 1
    if (!clickable) return styles.line

    if (revealed) {
      if (lineNum === correctLine) return `${styles.line} ${styles.lineCorrect}`
      if (lineNum === selectedLine && lineNum !== correctLine) return `${styles.line} ${styles.lineWrong}`
      return styles.line
    }
    if (lineNum === selectedLine) return `${styles.line} ${styles.lineSelected}`
    return `${styles.line} ${styles.lineClickable}`
  }

  return (
    <div
      className={blockClass}
      onClick={choiceMode && !revealed ? onChoose : undefined}
      style={{ cursor: choiceMode && !revealed ? 'pointer' : 'default' }}
    >
      {label && (
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          {choiceMode && revealed && isAnswer  && <span className={styles.correctBadge}>✓ CORRECT</span>}
          {choiceMode && revealed && isChosen && !isAnswer && <span className={styles.wrongBadge}>✗ WRONG</span>}
        </div>
      )}
      <pre className={styles.pre}>
        {lines.map((line, i) => {
          const lineNum = i + 1
          const tokens  = tokenizeLine(line)
          return (
            <div
              key={i}
              className={lineClass(i)}
              onClick={clickable && !revealed ? () => onClickLine?.(lineNum) : undefined}
              title={clickable && !revealed ? `Click if line ${lineNum} is wrong` : undefined}
            >
              <span className={styles.lineNum}>{lineNum}</span>
              <span className={styles.lineContent}>
                {tokens.map((tok, j) => (
                  <span key={j} style={{ color: TOKEN_COLORS[tok.type] ?? TOKEN_COLORS.plain }}>
                    {tok.text}
                  </span>
                ))}
              </span>
              {revealed && lineNum === correctLine && (
                <span className={styles.lineMarker}>← bug here</span>
              )}
            </div>
          )
        })}
      </pre>
    </div>
  )
}