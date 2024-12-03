import React from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">G1 Test Preparation</h1>
          <p className="text-lg text-gray-600">Practice for your G1 test with our comprehensive quiz system</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Quiz</h2>
              <p>Take a 40-question practice test</p>
              <div className="card-actions justify-end">
                <Link to="/quiz" className="btn btn-primary">Start Quiz</Link>
              </div>
            </div>
          </div>
  
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">All Questions</h2>
              <p>Browse and study all questions</p>
              <div className="card-actions justify-end">
                <Link to="/questions" className="btn btn-secondary">View Questions</Link>
              </div>
            </div>
          </div>
  
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Statistics</h2>
              <p>View your performance stats</p>
              <div className="card-actions justify-end">
                <Link to="/stats" className="btn">View Stats</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default HomePage;