import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ExamSelect from './pages/ExamSelect'
import Practice from './pages/Practice'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import WrongQuestions from './pages/WrongQuestions'
import WrongQuiz from './pages/WrongQuiz'
import Challenge from './pages/Challenge'
import ChallengeQuiz from './pages/ChallengeQuiz'
import ChallengeResult from './pages/ChallengeResult'
import SpacedReview from './pages/SpacedReview'
import ReviewQuiz from './pages/ReviewQuiz'

function App() {
  // #region agent log
  if (typeof fetch !== 'undefined') fetch('http://127.0.0.1:7242/ingest/f2b3e46d-a0cf-4e75-83a0-2f3b42951dae', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'App.jsx:render', message: 'App render', data: {}, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) }).catch(() => {});
  // #endregion
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/exam" element={<ExamSelect />} />
        <Route path="/practice/:examType" element={<Practice />} />
        <Route path="/quiz/:examType" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/wrong" element={<WrongQuestions />} />
        <Route path="/wrong/quiz" element={<WrongQuiz />} />
        <Route path="/review" element={<SpacedReview />} />
        <Route path="/review/session" element={<ReviewQuiz />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/challenge/result" element={<ChallengeResult />} />
        <Route path="/challenge/:examType" element={<ChallengeQuiz />} />
      </Route>
    </Routes>
  )
}

export default App
