import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => console.error('Error fetching user:', err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:5000/api/users/${id}` : 'http://localhost:5000/api/users';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          navigate('/users');
        }
      })
      .catch((err) => console.error('Error saving user:', err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Inline styles variable
  const styles = {
    container: {
      width: '100%',
      maxWidth: '400px',
      margin: 'auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      fontFamily: 'Arial, Helvetica, sans-serif',
    },
    header: {
      textAlign: 'center',
      fontSize: '26px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#333',
      outline: 'none',
      transition: 'border 0.3s ease',
    },
    inputFocus: {
      border: '1px solid #1877f2',
      boxShadow: '0 0 4px rgba(24, 119, 242, 0.5)',
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#1877f2',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#145dbf',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Register Here!</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          style={styles.input}
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          style={styles.input}
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          style={styles.input}
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default UserForm;
