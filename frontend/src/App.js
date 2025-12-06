import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import EnquiryForm from './components/EnquiryForm';
import AdminEnquiries from './components/AdminEnquiries';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="logo">GVCC Product Showcase</div>
          <div className="nav-links">
            <Link className="nav-link" to="/">Products</Link>
            <Link className="nav-link" to="/admin">Admin</Link>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/enquire/:id" element={<EnquiryForm />} />
            <Route path="/admin" element={<AdminEnquiries />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
