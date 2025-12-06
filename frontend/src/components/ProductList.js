import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/products')
      .then(res => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="status-text">Loading products...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="page fade-in">
      <h2 className="page-title">Products</h2>

      <div className="products-grid">
        {products.map((p, index) => (
          <div
            key={p.id}
            className="product-card fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="product-tag">{p.category || 'General'}</div>
            <h3 className="product-name">{p.name}</h3>
            <p className="product-desc">{p.short_desc}</p>
            <p className="product-price">₹{p.price}</p>
            <Link to={`/product/${p.id}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
