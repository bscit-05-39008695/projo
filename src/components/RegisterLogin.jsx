import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterLogin.css';

const RegisterLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
  
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const endpoint = isLogin ? 'http://127.0.0.1:5002/login' : 'http://127.0.0.1:5002/register';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isLogin ? {} : { confirm_password: formData.confirmPassword })
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setError(result.error || 'An error occurred');
      } else {
        setSuccess(result.message || 'Operation successful');
        if (isLogin) {  // Only navigate if it's a login (not registration)
          navigate('/track');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };
  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {isLogin ? 'Login' : 'Register'}
      </h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <label className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Confirm your password"
            />
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="toggle-container">
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({
              email: '',
              password: '',
              confirmPassword: ''
            });
          }}
          className="toggle-button"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default RegisterLogin;
