import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JobAnalyzer } from './pages/JobAnalyzer';
import { ActionPlanner } from './pages/ActionPlanner';
import { ResumeCoach } from './pages/ResumeCoach';
import { InterviewCoach } from './pages/InterviewCoach';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/job-analyzer" element={<JobAnalyzer />} />
            <Route path="/action-planner" element={<ActionPlanner />} />
            <Route path="/resume-coach" element={<ResumeCoach />} />
            <Route path="/interview-coach" element={<InterviewCoach />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
