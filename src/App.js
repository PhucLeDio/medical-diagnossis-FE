import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DiagnosisForm from "./components/DiagnosisForm";
import History from "./components/History";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <div className="navbar">
            <nav>
              <Link to="/">🩺 Chẩn Đoán</Link>
              <Link to="/history">📋 Lịch Sử</Link>
            </nav>
          </div>

          <Routes>
            <Route path="/" element={<DiagnosisForm />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
