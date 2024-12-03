import { useState, useEffect } from "react";
import axios from "axios";
import config from '../config';

function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hideAnswers, setHideAnswers] = useState(
    localStorage.getItem("hideAnswers") === "true"
  );
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/api/questions`, {
          headers: { Authorization: `Bearer ${token}` },
      });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token]);

  const toggleAnswersVisibility = () => {
    const newHideAnswersState = !hideAnswers;
    setHideAnswers(newHideAnswersState);
    localStorage.setItem("hideAnswers", newHideAnswersState.toString());
    // Reset selected answers when toggling
    setSelectedAnswers({});
  };

  const handleOptionSelect = (questionId, selectedOption) => {
    if (hideAnswers) {
      const isCorrect =
        questions.find((q) => q.id === questionId).correct_answer ===
        selectedOption;

      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: {
          selected: selectedOption,
          isCorrect: isCorrect,
        },
      }));
    }
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
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center">All Questions</h2>
        <div className="flex mt-3">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            defaultChecked={hideAnswers}
            onChange={toggleAnswersVisibility}
          />
          <span className="label-text ml-3">Interactive Mode</span>
        </div>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {questions.map((question) => (
          <div key={question.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {question.question_type === "Traffic Signs" && (
                <div className="mb-4">
                  <img
                      src={`${config.API_URL}/static/images/${question.question}.png`}
                      alt="Traffic Sign"
                      className="mx-auto max-w-xs"
                  />
                </div>
              )}
              <h3 className="card-title text-lg mb-4">
                {question.question_type === "Traffic Signs"
                  ? "What does this sign mean?"
                  : question.question}
              </h3>
              <div className="flex flex-col gap-3">
                {question.options.map((option, idx) => {
                  let buttonClass = "btn btn-outline btn-ghost";
                  const selectedAnswer = selectedAnswers[question.id];

                  if (!hideAnswers) {
                    // Show answers directly
                    buttonClass =
                      option === question.correct_answer
                        ? "btn btn-outline btn-success cursor-default"
                        : "btn btn-outline btn-ghost cursor-default";
                  } else if (
                    selectedAnswer &&
                    selectedAnswer.selected === option
                  ) {
                    // Show feedback based on selection when answers are hidden
                    buttonClass = selectedAnswer.isCorrect
                      ? "btn btn-outline btn-success animate-pulse"
                      : "btn btn-outline btn-error animate-shake";
                  }

                  return (
                    <button
                      key={idx}
                      className={buttonClass}
                      onClick={() => handleOptionSelect(question.id, option)}
                      disabled={
                        !hideAnswers && option !== question.correct_answer
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllQuestions;
