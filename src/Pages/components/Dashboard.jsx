// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNew] = useState({ name: "", category: "", price: 0 });

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
    setProducts(res.data);
  };

  const createProduct = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/products`, newProduct, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNew({ name: "", category: "", price: 0 });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>

      <input placeholder="Tên" onChange={e => setNew({ ...newProduct, name: e.target.value })} />
      <input placeholder="Danh mục (VD: điện thoại, phụ kiện...)" onChange={e => setNew({ ...newProduct, category: e.target.value })} />
      <input type="number" placeholder="Giá" onChange={e => setNew({ ...newProduct, price: e.target.value })} />
      <button onClick={createProduct}>Thêm sản phẩm</button>

      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} - {p.category} - {p.price}đ
            <button onClick={() => deleteProduct(p._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
