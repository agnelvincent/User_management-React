import React,{useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setAuthData,clearAuthData } from '../../redux/auth/authSlice';
import './Home.css';

function Home() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        dispatch(setAuthData({ user: parsedUserData }));
      } else {
        navigate('/login');
      }
    }
  }, [dispatch, navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(clearAuthData());
    navigate('/login');
  };

  // Home.jsx
return (
  <div className="home-container">
    <nav className="navbar">
      <div className="nav-content">
        <div className="navbar-brand ">
          <i className="fas fa-network-wired"></i>
          <span>Connect Me</span>
        </div>
        <div className="navbar-menu">
          <Link to="/user-profile" className="navbar-item">
            <i className="fas fa-user-circle"></i>
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="navbar-item logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
    <main className="main-content">
      <div className="welcome-section">
        <h1><br/>Welcome back, {user ? user.first_name : 'Guest'}!</h1>
        
      </div>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <i className="fas fa-user-edit"></i>
          <h3>Profile Management</h3>
          <p>Update your personal information and profile picture</p>
          <Link to="/user-profile" className="card-link">Edit Profile</Link>
        </div>
      </div>
    </main>
  </div>
);
}

export default Home;