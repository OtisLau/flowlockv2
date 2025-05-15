import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import SenderPage from './pages/SenderPage';
import ReceiverPage from './pages/ReceiverPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sender" element={<SenderPage />} />
          <Route path="/receiver" element={<ReceiverPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 