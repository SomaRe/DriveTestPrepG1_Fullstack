import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

function QuizDetails() {
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/quiz/session/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessionDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching session details:', error);
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [sessionId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Quiz Results</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/stats')}>
              Back to History
            </button>
          </div>
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-title">Date</div>
              <div className="stat-value text-sm">
                {new Date(sessionDetails.date).toLocaleDateString()}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Score</div>
              <div className="stat-value text-primary">
                {sessionDetails.total_score}/{sessionDetails.total_questions}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sessionDetails.attempts.map((attempt, index) => (
          <div 
            key={index} 
            className={`card bg-base-100 shadow-xl border ${
              attempt.user_answer && attempt.user_answer !== attempt.correct_answer ? 'border-red-500' : ''
            }`}
          >
            <div className="card-body">
              <div className="flex justify-between mb-4">
                <span className="text-sm">Question {index + 1}</span>
                <span className="text-sm">{attempt.question_type}</span>
              </div>
              
              {attempt.image_path && (
                <div className="mb-6">
                  <img
                    src={`${config.API_URL}/static/images/${attempt.image_path}`}
                    alt="Traffic Sign"
                    className="mx-auto max-w-xs"
                  />
                </div>
              )}
              
              <p className="text-xl mb-6">{attempt.question}</p>
              
              <div className="flex flex-col gap-3">
                {attempt.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`btn btn-outline ${
                      option === attempt.correct_answer
                      ? 'btn-success'
                      : option === attempt.user_answer && option !== attempt.correct_answer
                      ? 'btn-error'
                      : ''
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizDetails;