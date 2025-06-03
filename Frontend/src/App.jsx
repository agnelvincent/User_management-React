import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/login/Login"
import Signup from "./components/signup/Signup"
import Home from "./components/home/Home.jsx"
import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"
import UserProfile from "./components/home/UserProfile"
import CreateUserPage from "./components/admin/CreateUserPage.jsx"
import AdminRedirect from "./components/defaultadmin/defaultadmin.jsx"
import AdminEditUser from "./components/admin/AdminEditUser.jsx"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes  */}
        <Route path="/admin/editUser" element={<AdminEditUser />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUserPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* User routes */}
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/defaultadmin" element={<AdminRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;