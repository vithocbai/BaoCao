import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎉 Chào mừng bạn đến với trang Dashboard!</h1>
      <p>Đây là nội dung chỉ người đã đăng nhập mới xem được.</p>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px" }}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Dashboard;
