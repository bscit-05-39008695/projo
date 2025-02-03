import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterLogin from './components/RegisterLogin.jsx';
import TrackPage from './components/TrackPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Track Page */}
        <Route path="/track" element={<TrackPage />} />
        
        {/* Login/Register Page */}
        <Route path="/" element={<RegisterLogin />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

export default App;