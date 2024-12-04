import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from '../config';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${config.API_URL}/api/quiz/random`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz questions");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [token]);

  const handleOptionChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const calculateResults = () => {
    let correct = 0;
    let total = questions.length;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });

    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    };
  };

  const submitQuizResults = async (results) => {
    try {
        const answersData = questions.map(q => ({
            question_id: q.id,
            user_answer: answers[q.id],
            is_correct: answers[q.id] === q.correct_answer
        }));
        const response = await axios.post(
            `${config.API_URL}/api/quiz/submit`,
            { answers: answersData },
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response.data.session_id; // Assume backend returns session ID
    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
};

const handleSubmit = async () => {
    const results = calculateResults();
    const sessionId = await submitQuizResults(results);
    setResults({...results, sessionId});
    setCompleted(true);
};

  const handleTryAgain = () => {
    setCurrent(0);
    setAnswers({});
    setCompleted(false);
    setResults(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    );
  }

  if (completed && results) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-4">
              Quiz Results
            </h2>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value text-primary">
                  {results.percentage}%
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Correct Answers</div>
                <div className="stat-value">
                  {results.correct}/{results.total}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button className="btn btn-primary" onClick={handleTryAgain}>
                Try Again
              </button>
              <button className="btn btn-info" onClick={() => navigate(`/quiz-details/${results.sessionId}`)}>
                  View Details
              </button>
              <button className="btn" onClick={() => navigate("/")}>
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="p-4 text-center">No questions available.</div>;
  }

  const question = questions[current];

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between mb-4">
            <span className="text-sm">
              Question {current + 1} of {questions.length}
            </span>
            <span className="text-sm">{question.question_type}</span>
          </div>

          <div className="text-center mb-6">
            {question.question_type === "Traffic Signs" && (
              <div className="mb-6">
                <img
                  src={`${config.API_URL}/static/images/${question.question}.png`}
                  alt="Traffic Sign"
                  className="mx-auto max-w-xs"
                />
              </div>
            )}

            <p className="text-xl mb-6">
              {question.question_type === "Traffic Signs"
                ? "What does this sign mean?"
                : question.question}
            </p>

            <div className="flex flex-col gap-3">
              {question.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`btn btn-outline ${
                    answers[question.id] === option ? "btn-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    className="hidden"
                    checked={answers[question.id] === option}
                    onChange={() => handleOptionChange(question.id, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="btn"
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              disabled={current === 0}
            >
              Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrent((prev) => prev + 1)}
                disabled={!answers[question.id]}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Submit Quiz
              </button>
            )}
          </div>

          <div className="mt-4">
            <progress
              className="progress progress-primary w-full"
              value={Object.keys(answers).length}
              max={questions.length}
            ></progress>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
