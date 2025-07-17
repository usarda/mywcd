import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Styles similar to register.js
const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: 32,
    fontFamily: 'Segoe UI, Arial, sans-serif'
  },
  title: {
    fontSize: '2rem',
    marginBottom: 24,
    textAlign: 'center',
    color: '#0070f3'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18
  },
  formGroup: {
    marginBottom: 18
  },
  label: {
    fontWeight: 500,
    marginBottom: 6,
    display: 'block',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 5,
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginTop: 4,
    boxSizing: 'border-box'
  },
  button: {
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    padding: '10px 22px',
    fontSize: '1.08rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 12
  },
  message: {
    padding: '10px 18px',
    borderRadius: 6,
    marginBottom: 18,
    fontSize: '1.05rem'
  },
  fieldset: {
    border: '1px solid #eee',
    borderRadius: 7,
    padding: 18,
    marginTop: 10,
    marginBottom: 10,
    background: '#f6f8fa'
  },
  legend: {
    fontWeight: 600,
    color: '#0070f3',
    fontSize: '1.08rem',
    marginBottom: 8
  }
};

/* // Initialize Supabase client (use env variables or hardcode for local testing)
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
); */

function OrgRegister() {
  const [form, setForm] = useState({
    orgName: '',
    email: '',
    address: '',
    contact: '',
    website: '',
    industryType: '',
    primaryContact: {
      name: '',
      email: '',
      phone: '',
      designation: ''
    }
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('primaryContact.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        primaryContact: {
          ...prev.primaryContact,
          [key]: value
        }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for Supabase
    const orgData = {
      org_name: form.orgName,
      email: form.email,
      address: form.address,
      contact: form.contact,
      website: form.website,
      industry_type: form.industryType,
      primary_contact_name: form.primaryContact.name,
      primary_contact_email: form.primaryContact.email,
      primary_contact_phone: form.primaryContact.phone,
      primary_contact_designation: form.primaryContact.designation
    };

    // Persist to Supabase
    const { data, error } = await supabase
      .from('organizations')
      .insert([orgData]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Organization registered successfully!');
      setForm({
        orgName: '',
        email: '',
        address: '',
        contact: '',
        website: '',
        industryType: '',
        primaryContact: {
          name: '',
          email: '',
          phone: '',
          designation: ''
        }
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Organization Registration</h2>
      {message && (
        <div
          style={{
            ...styles.message,
            backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24'
          }}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Organization Name:</label>
          <input
            type="text"
            name="orgName"
            value={form.orgName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Organization Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Address:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Contact Number:</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Website:</label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Industry Type:</label>
          <input
            type="text"
            name="industryType"
            value={form.industryType}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Primary Contact Person</legend>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="primaryContact.name"
              value={form.primaryContact.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="primaryContact.email"
              value={form.primaryContact.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone:</label>
            <input
              type="text"
              name="primaryContact.phone"
              value={form.primaryContact.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Designation:</label>
            <input
              type="text"
              name="primaryContact.designation"
              value={form.primaryContact.designation}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </fieldset>
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

export default OrgRegister;