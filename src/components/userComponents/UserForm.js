import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import dayjs from 'dayjs';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    phone: '',
    location: '',
    password: '',
    avatar: '',
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.birthday) {
            data.birthday = dayjs(data.birthday).format('YYYY-MM-DD');
          }
          setFormData(data);
        })
        .catch((err) => console.error('Error fetching user:', err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:5000/api/users/${id}`
      : `http://localhost:5000/api/users`;

    const payload = {
      ...formData,
      birthday: formData.birthday ? dayjs(formData.birthday).toISOString() : null,
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          navigate('/profile/:id');
        }
      })
      .catch((err) => console.error('Error saving user:', err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const styles = {
    avatar: { width: 100, height: 100, margin: '20px auto', display: 'block' },
    input: { marginBottom: '10px', width: '100%' },
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <Avatar
        alt={formData.firstName}
        src={formData.avatar || ''}
        style={styles.avatar}
      >
        {(!formData.avatar && formData.firstName) ? formData.firstName[0].toUpperCase() : ''}
      </Avatar>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="avatar"
          placeholder="Avatar URL"
          value={formData.avatar}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default UserForm;


