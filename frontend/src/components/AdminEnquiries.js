import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/enquiries')
      .then(res => {
        setEnquiries(res.data.enquiries);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching enquiries:', err);
        setError('Failed to load enquiries');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="status-text">Loading enquiries...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="page fade-in">
      <h2 className="page-title">Admin – Enquiries</h2>

      <div className="card card-table">
        {enquiries.length === 0 ? (
          <p className="status-text">No enquiries yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.product_name || '-'}</td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.phone || '-'}</td>
                    <td>{e.message}</td>
                    <td>{e.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card-footer">
          <Link to="/" className="btn btn-ghost">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminEnquiries;
