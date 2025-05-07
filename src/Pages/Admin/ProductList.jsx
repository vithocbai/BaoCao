import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@pages/components/AdminLayout';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
        <a href="/admin/add" className="bg-green-500 text-white px-4 py-2 rounded">+ Thêm mới</a>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Danh mục</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.price.toLocaleString()}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border">
                <a href={`/admin/edit/${p._id}`} className="text-blue-600 mr-2">Sửa</a>
                <button onClick={() => deleteProduct(p._id)} className="text-red-600">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default ProductList;
