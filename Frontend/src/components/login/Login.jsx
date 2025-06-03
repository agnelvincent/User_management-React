import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosconfig';
import { setAuthData } from '../../redux/auth/authSlice';
import './Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
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
            setError(''); 
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.status === 401) {
               
                setError('Invalid username or password.');
            } else {
                setError('Something went wrong. Please try again later.');
            }
            console.error('Login Failed:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>WELCOME</h2>

                {error && <p className="err-msg">{error}</p>}

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
