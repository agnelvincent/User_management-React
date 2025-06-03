import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthData, setAuthData } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../adminaxiosconfig";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = useSelector((state) => state.auth.user);
  const [activeUsers, setActiveUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setsearch] = useState("");

  const searchingUser = activeUsers
    .filter((user) =>
      user.first_name.toLowerCase().includes(search.toLowerCase())
    )

  useEffect(() => {
    if (!user) {
      const storedAdminData = localStorage.getItem("adminData");
      if (storedAdminData) {
        dispatch(setAuthData(JSON.parse(storedAdminData)));
      } else {
        navigate("/admin/login");
      }
    }
    fetchDashboardData();
  }, [dispatch, navigate, user]);

  const handleCreateUser = () => {
    navigate("/admin/create-user");
  };

  const fetchDashboardData = async () => {
    try {
      const response = await adminAxiosInstance.get("/admin/dashboard/");
      setActiveUsers(response.data.active_users);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      if (error.response && error.response.status === 401) {
        navigate("/admin/login");
      }
    }
  };

  const handleLogout = () => {
    dispatch(clearAuthData());
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  
  const editUser = (user) => {
    navigate("/admin/editUser", { 
      state: { 
        user: user  
      } 
    });
  };
  
  
  const deleteUser = async (userid) => {
    try {
      await adminAxiosInstance.delete(`/admin/deleteUser/${userid}/`);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed for user deletion" + error);
    }
  };
  const UserTable = ({ users, tableTitle }) => (
    <div className="user-table-container">
      <h3 className="table-title">{tableTitle}</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>
                <button
                  className={`action-btn unblock-btn` }
                  onClick={() => editUser(user)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={`action-btn block-btn`}
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <span className="welcome-message">
              Welcome back, {user ? user.first_name : "Admin"}!
            </span>
            <div className="header-actions">
              <button className="create-btn" onClick={handleCreateUser}>
                <i className="fas fa-plus"></i> Create User
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </header>
  
      <main className="dashboard-content">
        <div className="dashboard-tools">
          <div className="message-container">
            <p className="dashboard-message">{message}</p>
          </div>
          <div className="search-container">
            <input 
              type="search" 
              value={search} 
              onChange={(event) => setsearch(event.target.value)}  
              placeholder="Search users..."
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
        </div>
  
        <div className="users-section">
          <UserTable 
            users={searchingUser.length > 0 ? searchingUser : activeUsers} 
            tableTitle="User Management" 
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
