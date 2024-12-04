import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom'

function Stats() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/quiz/history`, {
          headers: { Authorization: `Bearer ${token}` }
      });
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching history:', error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading) {
    return <div className="flex justify-center p-4"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  const handleViewDetails = (sessionId) => {
      navigate(`/quiz-details/${sessionId}`);
  };


  return (
    <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Questions</th>
                        <th>Percentage</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((session) => (
                        <tr key={session.id}>
                            <td>{new Date(session.date).toLocaleDateString()}</td>
                            <td>{session.score}</td>
                            <td>{session.total}</td>
                            <td>{session.percentage.toFixed(1)}%</td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-info"
                                    onClick={() => handleViewDetails(session.id)}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
}

export default Stats;