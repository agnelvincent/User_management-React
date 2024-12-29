import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { clearAuthData } from '../../redux/auth/authSlice'
import axiosInstance from '../../axiosconfig'
import './UserProfile.css'
function UserProfile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [fileError, setFileError] = useState('');
  


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('user-profile/');
      setProfile(response.data);
      setNewUsername(response.data.username);
      setError(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response && error.response.status === 401) {
        // Unauthorized, token might be expired
        handleLogout();
      } else {
        setError('Failed to fetch profile. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUsernameError('');
    setFileError('');
  };

  const validateUsername = (username) => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false
    } else if (!/^[a-zA-Z]+$/.test(username)) {  // Updated regex to only allow letters
      setUsernameError( "Username can only contain letters (no numbers or special characters)");
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateFile = (file) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, and PNG files are allowed");
        return false;
      }
    }
    setFileError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateUsername(newUsername) || !validateFile(newProfilePicture)) {
      return;
    }
    const formData = new FormData();
    formData.append('username', newUsername);
    if (newProfilePicture) {
      formData.append('profile_picture', newProfilePicture);
    }

    try {
      await axiosInstance.put('user-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearAuthData());
    navigate('/login')
  }

  const handleBack=()=>{
    navigate('/home')
  }

  //above changed
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setNewProfilePicture(file);
    } else {
      e.target.value = ''; // Clear the file input
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" />
            ) : (
              <div className="profile-initial">{user?.first_name[0]}</div>
            )}
          </div>
          <h2 className="profile-name">
            Welcome {user?.first_name} {user?.last_name}
          </h2>
        </div>
        <div className="profile-body">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                placeholder="New username"
              />
              {usernameError && <span className="error">{usernameError}</span>}
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".jpg,.jpeg,.png"
              />
              {fileError && <span className="error">{fileError}</span>}
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
            </div>
          ) : (
            <div className="profile-info">
              <p>Username: {profile.username}</p>
              <div className="profile-actions">
                <button onClick={handleEdit} className="edit-btn">
                  Edit Profile
                </button>
                <button onClick={handleBack} className="edit-btn back-btn">
                  Back
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;