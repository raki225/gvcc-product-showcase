import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EnquiryForm() {
  const { id } = useParams(); // product id
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3001/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error loading product in enquiry form:', err));
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});

    axios.post('http://localhost:3001/api/enquiries', {
      product_id: id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message
    })
      .then(() => {
        setSubmitSuccess('Enquiry submitted successfully! Redirecting...');
        setForm({ name: '', email: '', phone: '', message: '' });

        setTimeout(() => {
          navigate('/');
        }, 1500);
      })
      .catch(err => {
        console.error('Error submitting enquiry:', err);
        setSubmitError('Failed to submit enquiry. Please try again.');
      });
  };

  return (
    <div className="page fade-in">
      <div className="card form-card">
        <h2 className="card-title">
          Enquire {product ? `about "${product.name}"` : ''}
        </h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Name</label>
            <input
              className={`input ${errors.name ? 'input-error' : ''}`}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className={`input ${errors.email ? 'input-error' : ''}`}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Phone (optional)</label>
            <input
              className="input"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              className={`input textarea ${errors.message ? 'input-error' : ''}`}
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <div className="error-text">{errors.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Submit Enquiry
          </button>
        </form>

        {submitError && <p className="status-text error">{submitError}</p>}
        {submitSuccess && <p className="status-text success">{submitSuccess}</p>}

        <div className="card-footer">
          <Link to="/" className="btn btn-ghost">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnquiryForm;
