import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import AllQuestions from "./components/AllQuestions";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import Stats from "./components/Stats";
import ProtectedRoute from "./components/ProtectedRoute";
import QuizDetails from "./components/QuizDetails";

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("token") || "");

  const handleLogout = () => {
    setAuth("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      {auth && (
        <div className="navbar bg-base-100 shadow-lg mb-8">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost normal-case text-xl">
              G1 Test Prep
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              {/* <li>
                <Link to="/quiz">Quiz</Link>
              </li>
              <li>
                <Link to="/questions">Questions</Link>
              </li>
              <li>
                <Link to="/stats">Statistics</Link>
              </li> */}
              <li>
                <button onClick={handleLogout} className="btn btn-error btn-sm">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute auth={auth}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute auth={auth}>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute auth={auth}>
              <AllQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute auth={auth}>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={auth ? "/" : "/login"} replace />}
        />
        <Route
          path="/quiz-details/:sessionId"
          element={
            <ProtectedRoute auth={auth}>
              <QuizDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
