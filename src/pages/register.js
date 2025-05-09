import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',    
    hostingdeclaration: false,
    eligibilitydeclaration: false,
    informationdeclaration: false,
    sharingdetailsdeclaration: false,
    socialmediaconsentdeclaration: false,
  });

  const [message, setMessage] = useState({ type: '', text: '' }); // State for feedback messages
  const [step, setStep] = useState(1); // State to track the current step

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Reset message state

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/; // Example: 10-digit phone number
    if (!phoneRegex.test(formData.phone)) {
      setMessage({ type: 'error', text: 'Invalid phone number. Please enter a 10-digit number.' });
      return;
    }

    if (!formData.hostingdeclaration || !formData.eligibilitydeclaration || !formData.informationdeclaration || !formData.sharingdetailsdeclaration || !formData.socialmediaconsentdeclaration) {
      setMessage({ type: 'error', text: 'You must agree to the declaration to proceed.' });
      return;
    }

    const { data, error } = await supabase
      .from('cowsanctuaries')
      .insert([formData]);

    if (error) {
      console.error('Error inserting data:', error);
      if (error.code === '23505') { // Unique violation error code
        setMessage({ type: 'error', text: 'Duplicate entry detected. Please use unique information.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to register. Please try again.' });
      }
    } else {
      console.log('Data inserted:', data);
      setMessage({ type: 'success', text: 'Registration successful!' });
      setFormData({ name: '', email: '', address: '', phone: '', declaration: false, hostingdeclaration: false, eligibilitydeclaration: false, informationdeclaration: false, sharingdetailsdeclaration: false, socialmediaconsentdeclaration: false }); // Reset form
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Registration Form</h1>
      {message.text && (
        <div
          style={{
            ...styles.message,
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
          }}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        {step === 1 && (
          <div>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="address" style={styles.label}>Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.label}>Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <button type="button" onClick={handleNext} style={styles.button}>Next</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={styles.formGroup}>
              <label htmlFor="hostingdeclaration" style={styles.label}>
                <input
                  type="checkbox"
                  id="hostingdeclaration"
                  name="hostingdeclaration"
                  checked={formData.hostingdeclaration || false}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '10px' }}
                />
                I am interested in hosting the World Cow Day event as per the guidelines of the event.
              </label>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="eligibilitydeclaration" style={styles.label}>
                <input
                  type="checkbox"
                  id="eligibilitydeclaration"
                  name="eligibilitydeclaration"
                  checked={formData.eligibilitydeclaration || false}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '10px' }}
                />
                I agree with the eligibility criteria for hosting the World Cow Day event.
              </label>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="informationdeclaration" style={styles.label}>
                <input
                  type="checkbox"
                  id="informationdeclaration"
                  name="informationdeclaration"
                  checked={formData.informationdeclaration || false}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '10px' }}
                />
                I confirm all the information provided is true.
              </label>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="sharingdetailsdeclaration" style={styles.label}>
                <input
                  type="checkbox"
                  id="sharingdetailsdeclaration"
                  name="sharingdetailsdeclaration"
                  checked={formData.sharingdetailsdeclaration || false}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '10px' }}
                />
                I give my consent to share my sanctuary details with the participants during the World Cow Day event
through the World Cow Day website.
              </label>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="socialmediaconsentdeclaration" style={styles.label}>
                <input
                  type="checkbox"
                  id="socialmediaconsentdeclaration"
                  name="socialmediaconsentdeclaration"
                  checked={formData.socialmediaconsentdeclaration || false}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '10px' }}
                />
                I give my consent to use the content that will be posted by us on our social media handles during the
World Cow Day Event for promotion of World Cow Day activities.
              </label>
            </div>
            <button type="button" onClick={handleBack} style={styles.button}>Back</button>
            <button type="submit" style={styles.button}>Submit</button>
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '10px',
  },
  message: {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
};