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
