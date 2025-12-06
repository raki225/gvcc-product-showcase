import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="status-text">Loading product...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (!product) return <p className="status-text">Product not found.</p>;

  return (
    <div className="page fade-in">
      <div className="card">
        <div className="card-header">
          <span className="pill">{product.category || 'General'}</span>
        </div>
        <div className="card-body">
          <h2 className="card-title">{product.name}</h2>
          <p className="card-price">₹{product.price}</p>
          <p className="card-text">{product.long_desc}</p>
        </div>
        <div className="card-footer">
          <Link to={`/enquire/${product.id}`} className="btn btn-primary">
            Enquire about this product
          </Link>
          <Link to="/" className="btn btn-ghost">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
