import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router'
import config from '../config'

function Login({ setAuth }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    try {
      const res = await axios.post(`${config.API_URL}${endpoint}`, { username, password });
      if (!isRegister) {
        // Login successful, set auth token
        setAuth(res.data.access_token);
        localStorage.setItem('token', res.data.access_token);
        navigate('/'); // Add this line to redirect to homepage
      } else {
        setMessage('Registration successful. Please log in.');
        setIsRegister(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl shadow-slate-800">
        <div className="card-body">
          <h2 className="card-title">{isRegister ? 'Register' : 'Login'}</h2>
          {message && <p className="text-red-500">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-2">
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">
                {isRegister ? 'Register' : 'Login'}
              </button>
            </div>
          </form>
          <div className="mt-4">
            <button
              className="text-blue-500"
              onClick={() => { setIsRegister(!isRegister); setMessage(''); }}
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;