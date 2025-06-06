// pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/urls';
import { useNavigate } from 'react-router-dom';
import "../styles/Auth.css";
import educatorImg from '../assets/educator.svg';

const Login = () => {
  const [username, setUsername] = useState('');     // Username input state
  const [password, setPassword] = useState('');     // Password input state
  const [errorMsg, setErrorMsg] = useState(null);     // Error message state
  const navigate = useNavigate();

  const validateInputs = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!usernameRegex.test(trimmedUsername)) {
      setErrorMsg('Username must be at least 3 characters long and contain only letters and numbers.');
      return false;
    }

    if (!passwordRegex.test(trimmedPassword)) {
      setErrorMsg('Password must be at least 6 characters long and include both letters and numbers.');
      return false;
    }

    return true;
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    // Basic input validation
    if (!validateInputs()) return;

    setErrorMsg(null);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { 
        username, 
        password 
      });
      // Save user info to localStorage
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('teacherId', res.data.teacherId);
      localStorage.setItem('role', 'teacher');
      localStorage.setItem('token', res.data.token);

      // Navigate to course admin dashboard
      navigate('/course-admin');
    } catch (err) {
      setErrorMsg('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="form-container">
      <img src={educatorImg} alt="Classroom" className="educator-img" />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')} className="link">
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
