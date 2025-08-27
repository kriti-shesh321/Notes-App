import {
  BrowserRouter as Router, Routes, Route
} from 'react-router-dom';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";

function App() {

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
