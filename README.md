# DevOps.Quiz — Senior Interview Prep

A responsive React quiz app for Senior DevOps interview preparation. 15 scenario-based questions covering Kubernetes, CI/CD, IaC, Observability, Security, Cloud Architecture, GitOps, Linux, Networking, Databases, and Docker.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
devops-quiz/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component + routing
    ├── App.module.css
    ├── data/
    │   ├── db.json           # All questions (edit here to add more)
    │   └── constants.js      # Category colors, difficulty config
    ├── hooks/
    │   └── useQuiz.js        # All quiz state logic
    ├── styles/
    │   └── index.css         # Global CSS variables + reset
    └── components/
        ├── Badge.jsx / .module.css
        ├── ProgressBar.jsx / .module.css
        ├── RingChart.jsx / .module.css
        ├── HomeScreen.jsx / .module.css
        ├── QuestionCard.jsx / .module.css
        └── ResultScreen.jsx / .module.css
```

## Adding Questions

Edit `src/data/db.json` and add objects following this schema:

```json
{
  "id": 16,
  "category": "Kubernetes",
  "difficulty": "hard",
  "question": "Your question here?",
  "options": [
    "Option A",
    "Option B (correct)",
    "Option C",
    "Option D"
  ],
  "answer": 1,
  "explanation": "Explanation shown after answering."
}
```

- `difficulty`: `"hard"` | `"medium"` | `"easy"`
- `answer`: zero-based index of the correct option
- Add new category colors in `src/data/constants.js`

## Tech Stack

- React 18
- Vite 5
- CSS Modules
- IBM Plex Mono + Bebas Neue fonts
