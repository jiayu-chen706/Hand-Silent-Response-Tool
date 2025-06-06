// pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/urls';
import { useNavigate } from 'react-router-dom';
import "../styles/Auth.css";
import educatorImg from '../assets/educator.svg';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    const trimmedUsername = form.username.trim();
    const trimmedPassword = form.password.trim();

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

  // Update form state on input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit registration form
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setErrorMsg(null);

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, form);
      navigate('/');  // Redirect to login page after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg('Registration failed. Try again.');
    }
  };

  return (
    <div className="form-container">
      <img src={educatorImg} alt="Classroom" className="educator-img" />
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Name:</label>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Username:</label>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{' '}
        <span onClick={() => navigate('/')} className="link">
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
