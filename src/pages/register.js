import { useState, useRef } from 'react';
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
    agreeTab0: false,
    agreeTab1: false,
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(0); // Start at 0 for the new intro page
  const [activeTab, setActiveTab] = useState(0); // 0 or 1 for the two tabs
  const [tab0Scrolled, setTab0Scrolled] = useState(false);
  const [tab1Scrolled, setTab1Scrolled] = useState(false);

  const tab0Ref = useRef(null);
  const tab1Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Enable checkbox only after scrolling to bottom of tab content
  const handleTabScroll = (tabIndex) => {
    const ref = tabIndex === 0 ? tab0Ref : tab1Ref;
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        if (tabIndex === 0) setTab0Scrolled(true);
        if (tabIndex === 1) setTab1Scrolled(true);
      }
    }
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage({ type: 'error', text: 'Invalid phone number. Please enter a 10-digit number.' });
      return;
    }

    if (
      !formData.hostingdeclaration ||
      !formData.eligibilitydeclaration ||
      !formData.informationdeclaration ||
      !formData.sharingdetailsdeclaration ||
      !formData.socialmediaconsentdeclaration
    ) {
      setMessage({ type: 'error', text: 'You must agree to the declaration to proceed.' });
      return;
    }

    const { data, error } = await supabase
      .from('cowsanctuaries')
      .insert([formData]);

    if (error) {
      console.error('Error inserting data:', error);
      if (error.code === '23505') {
        setMessage({ type: 'error', text: 'Duplicate entry detected. Please use unique information.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to register. Please try again.' });
      }
    } else {
      console.log('Data inserted:', data);
      setMessage({ type: 'success', text: 'Registration successful!' });
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        hostingdeclaration: false,
        eligibilitydeclaration: false,
        informationdeclaration: false,
        sharingdetailsdeclaration: false,
        socialmediaconsentdeclaration: false,
        agreeTab0: false,
        agreeTab1: false,
      });
      setTab0Scrolled(false);
      setTab1Scrolled(false);
    }
  };

  // Only allow proceeding if both checkboxes are checked
  const canProceed = formData.agreeTab0 && formData.agreeTab1;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <b>Registration Form</b>
      </h1>
       <b>Note: Scroll till end on both pages & agree to proceed</b>      
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
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        {step === 0 && (
          <div>
            <div style={styles.tabs}>
              <button
                type="button"
                style={{
                  ...styles.tab,
                  borderBottom: activeTab === 0 ? '2px solid #0070f3' : '2px solid #ccc',
                  fontWeight: activeTab === 0 ? 'bold' : 'normal',
                }}
                onClick={() => setActiveTab(0)}
              >
                About Event
              </button>
              <button
                type="button"
                style={{
                  ...styles.tab,
                  borderBottom: activeTab === 1 ? '2px solid #0070f3' : '2px solid #ccc',
                  fontWeight: activeTab === 1 ? 'bold' : 'normal',
                }}
                onClick={() => setActiveTab(1)}
              >
                Instructions
              </button>
            </div>
            <div style={styles.tabContent}>
              {activeTab === 0 && (
                <div>
                  <div
                    ref={tab0Ref}
                    style={{
                      maxHeight: 120,
                      overflowY: 'auto',
                      paddingRight: 10,
                      border: '1px solid #eee',
                      marginBottom: 10,
                    }}
                    onScroll={() => handleTabScroll(0)}
                  >
                    <h3>
                      <b>World Cow Day</b>
                    </h3>
                    <p>
                     <b> To,<br />                      
                      Sanctuaries, Rescue Centers,
                      Cruelty-free Dairy Farms, Farm Communities.</b>
                      <br /><br />
                      Greetings from World Cow Day Team!
                      World Cow Day is celebrated as a global day highlighting the significance of cows and their immense contribution towards sustainable development.
                      <br /><br />
                      World Cow Day 2025 will be celebrated on 1st Sept. However, the event celebration will commence from 15th Aug 2025 and conclude on 1st Sep 2025 on World Cow Day.
                      <br /><br />
                      Please refer below the registration process for hosting the World Cow Day event – <br /><br />
                      1. Refer to the registration criteria and event guidelines and agree with the eligibility criteria for hosting the World Cow Day event.<br />
                      2. Register your sanctuary/farm for hosting the World Cow Day event.<br />
                      3. Post registration, you will receive - <br />
                      - Event Host badge certifying you as an official Event Host for World Cow Day 2025. <br />
                      - Promotional material kit promoting your sanctuary/farm as an Event Host for World Cow Day 2025.<br />
                      Scroll to the end to enable the agreement checkbox.
                    </p>
                    <h3>
                      <b>ELIGIBILITY CRITERIA</b>
                    </h3>
                    <p>
                      Please note the criteria and guidelines below before registering for an Event Host for World Cow Day.
                      Criteria for Registration for World Cow Day event –
                      <br /><br />
                      <br /><br />
                      The organization hosting the event – <br />
                      1. Should not have any connection, engagement or involvement in any way of causing cruelty or slaughtering of cows or any other animals.<br /><br />
                      2. Should not be engaged or involved in any way in funding, promoting or trading of beef/meat or any part of cows/other animals that causes slaughtering or causing any form of harm to cows/other animals.<br /><br />
                      3. Should not be engaged in any type of cruelty to cows and male/female calves for milk production, i.e. calves’ separation at birth, forceful impregnation, unnatural milking, sending to slaughterhouses etc.<br /><br />
                      4. Should not have any track record of any criminal involvement as per the law of the state or any of the local government laws.<br /><br />
                    </p>
                  </div>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      name="agreeTab0"
                      checked={formData.agreeTab0}
                      onChange={handleChange}
                      disabled={!tab0Scrolled}
                      style={{ marginRight: '10px' }}
                    />
                    I agree
                  </label>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <div
                    ref={tab1Ref}
                    style={{
                      maxHeight: 120,
                      overflowY: 'auto',
                      paddingRight: 10,
                      border: '1px solid #eee',
                      marginBottom: 10,
                    }}
                    onScroll={() => handleTabScroll(1)}
                  >
                    <h3>
                      <b>Event Guidelines for hosting of World Cow’s Day event</b>
                    </h3>
                    <p>
                      Please note the guidelines below to be followed on the selected days for the visit of participants to the World Cow Day Event.<br /><br />
                      1. Entry will be free for all participants and there will be no charges to be levied for participation during the event on the selected days of participation.<br /><br />
                      2. Not to be engaged in any form of commercial, religious or political promotional activities in the name of World Cow Day event.<br /><br />
                      3. No racist, biased, caste based, etc. activities in any form in the name of World Cows Day event.<br /><br />
                      4. Not to engage in any kind of selling of any brand products in the name of World Cows Day event.<br /><br />
                      5. Only cow-based sustainable products promoting the benefits of health and environment in line with the World Cows Day event may be allowed with prior intimation.<br /><br />
                    </p>
                  </div>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      name="agreeTab1"
                      checked={formData.agreeTab1}
                      onChange={handleChange}
                      disabled={!tab1Scrolled}
                      style={{ marginRight: '10px' }}
                    />
                    I agree
                  </label>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleNext}
              style={styles.button}
              disabled={!canProceed}
            >
              Proceed to Registration
            </button>
          </div>
        )}
        {step === 1 && (
          <div>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Name:
              </label>
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
              <label htmlFor="email" style={styles.label}>
                Email:
              </label>
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
              <label htmlFor="address" style={styles.label}>
                Address:
              </label>
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
              <label htmlFor="phone" style={styles.label}>
                Phone Number:
              </label>
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
            <button
              type="button"
              onClick={handleBack}
              style={styles.button}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={styles.button}
            >
              Next
            </button>
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
            <button
              type="button"
              onClick={handleBack}
              style={styles.button}
            >
              Back
            </button>
            <button
              type="submit"
              style={styles.button}
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px', // Increased width
    minHeight: '80vh', // Taller container
    margin: '40px auto',
    padding: '40px',
    border: '1px solid #ccc',
    borderRadius: '16px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '2.2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.1rem',
  },
  formGroup: {
    marginBottom: '22px',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '1.05rem',
    display: 'block',
  },
  input: {
    padding: '14px',
    border: '1px solid #ccc',
    borderRadius: '7px',
    width: '100%',
    fontSize: '1.05rem',
    marginTop: '6px',
  },
  button: {
    padding: '12px 28px',
    border: 'none',
    borderRadius: '7px',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '14px',
    marginTop: '14px',
    fontSize: '1.08rem',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  message: {
    padding: '14px',
    borderRadius: '7px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '1.08rem',
  },
  tabs: {
    display: 'flex',
    marginBottom: '18px',
    borderBottom: '2px solid #ccc',
  },
  tab: {
    flex: 1,
    padding: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    fontSize: '1.1rem',
  },
  tabContent: {
    padding: '18px 0 28px 0',
    minHeight: '180px',
    fontSize: '1.08rem',
  },
};