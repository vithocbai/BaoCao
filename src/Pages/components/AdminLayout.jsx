import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="bg-white p-6 rounded shadow">{children}</div>
    </div>
  );
};

export default AdminLayout;
