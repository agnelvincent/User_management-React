import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosconfig';
import { setAuthData } from '../../redux/auth/authSlice';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/login/', { email, password });
            const { user, token } = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            dispatch(setAuthData(response.data));
            navigate('/home')
        } catch (error) {
            console.error('Login Failed:', error)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Connect ME</h2>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Login Now
                    </button>
                </form>

                <div className="login-links">
                    <p>Don't have an account? <Link to="/signup">Signup</Link></p>
                    <Link to="/admin/login">Admin Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
