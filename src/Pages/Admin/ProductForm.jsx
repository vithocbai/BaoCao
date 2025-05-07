// src/pages/Admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@pages/components/AdminLayout';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    image: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
  });

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:5000/api/products/${id}`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`http://localhost:5000/api/products/${id}`, form);
    } else {
      await axios.post('http://localhost:5000/api/products', form);
    }
    navigate('/admin');
  };

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === 'price' || key === 'countInStock' ? 'number' : 'text'}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            required
            className="border p-2 rounded"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </form>
    </AdminLayout>
  );
};

export default ProductForm;


