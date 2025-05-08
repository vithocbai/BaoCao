// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        username,
        password
      });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/admin/login");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div>
      <h2>Đăng ký tài khoản quản trị</h2>
      <input placeholder="Tài khoản" onChange={e => setUser(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" onChange={e => setPass(e.target.value)} />
      <button onClick={handleRegister}>Đăng ký</button>
    </div>
  );
}

export default Register;
