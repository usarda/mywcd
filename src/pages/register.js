import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',   
    phone: '',
    organizationtype: '',
    organizationtypeother: '',
    registeredorgname: '',
    founders: '',
    foundercontact: '',
    country: '',
    state: '',
    city: '',
    visitaddress: '',
    locationlink: '',
    website: '',
    sociallinks: '',
    hostingdeclaration: false,
    eligibilitydeclaration: false,
    informationdeclaration: false,
    sharingdetailsdeclaration: false,
    socialmediaconsentdeclaration: false,
    agreetab0: false,
    agreetab1: false,
    numcows: '0',
    numbullsoxencalves: '0',
    area: '',
    visitorcapacity: '0',
    teammembers: '0',
    volunteers: '0',
    otheractivities: '',
    uniqueinitiative: '',
    awards: '',
    participation: '',
    eventdays: '', // 'all' or 'custom'
    customdays: '',
    customdaysreason: '',
    visittimingtype: '', // 'all' or 'slot'
    alldayfrom: '',
    alldayto: '',
    slotmorningfrom: '',
    slotmorningto: '',
    slotafternoonfrom: '',
    slotafternoonto: '',
    sloteveningfrom: '',
    sloteveningto: '',
    activitiesonsite: [],
    activitiesonsiteother: '',
    activitieslocality: [],
    activitieslocalityother: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [tab0Scrolled, setTab0Scrolled] = useState(false);
  const [tab1Scrolled, setTab1Scrolled] = useState(false);
  const [warning, setWarning] = useState('');

  // Refs for required fields
  const registeredorgnameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const visitaddressRef = useRef(null);
  const numcowsRef = useRef(null);
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  const tab0Ref = useRef(null);
  const tab1Ref = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

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
    if (step === 0 && !(formData.agreetab0 && formData.agreetab1)) {
      setWarning('Please scroll to the end and agree to both Event and Instructions before proceeding.');
      return;
    }
    setWarning('');
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation for required fields
    let newErrors = {};
    if (!formData.registeredorgname) newErrors.registeredorgname = 'Required';
    if (!formData.phone) newErrors.phone = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.visitaddress) newErrors.visitaddress = 'Required';
    if (!formData.numcows || Number(formData.numcows) <= 0) newErrors.numcows = 'Required';
    if (!formData.country) newErrors.country = 'Required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.city) newErrors.city = 'Required';

    // Phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Map each field to its step
      const fieldStepMap = {
        registeredorgname: 1,
        phone: 1,
        email: 1,
        visitaddress: 1,
        country: 1,
        state: 1,
        city: 1,
        numcows: 2,
      };
      const fieldRefMap = {
        registeredorgname: registeredorgnameRef,
        phone: phoneRef,
        email: emailRef,
        visitaddress: visitaddressRef,
        numcows: numcowsRef,
        country: countryRef,
        state: stateRef,
        city: cityRef,
      };
      const firstErrorField = Object.keys(newErrors)[0];
      const errorStep = fieldStepMap[firstErrorField];

      // If not on the step with the error, switch to it first, then focus after render
      if (step !== errorStep) {
        setStep(errorStep);
        setTimeout(() => {
          if (fieldRefMap[firstErrorField] && fieldRefMap[firstErrorField].current) {
            fieldRefMap[firstErrorField].current.focus();
          }
        }, 100);
      } else {
        setTimeout(() => {
          if (fieldRefMap[firstErrorField] && fieldRefMap[firstErrorField].current) {
            fieldRefMap[firstErrorField].current.focus();
          }
        }, 0);
      }
      return;
    }
    setErrors({});

    const submissionData = { ...formData };
    if (submissionData.alldayfrom && submissionData.alldayto) {
      delete submissionData.slotmorningfrom;
      delete submissionData.slotmorningto;
      delete submissionData.slotafternoonfrom;
      delete submissionData.slotafternoonto;
      delete submissionData.sloteveningfrom;
      delete submissionData.sloteveningto;
    }

    const { data, error } = await supabase
      .from('cowsanctuaries108')
      .insert([submissionData]);

    if (error) {
      console.error('Error inserting data:', error);
      if (error.code === '23505') {
        setMessage({ type: 'error', text: 'Duplicate entry detected. Please use unique information.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to register. Please try again.' });
      }
    } else {
      setMessage({ type: 'success', text: 'Registration successful!' });
      setFormData({
        name: '',
        email: '',
        address: '',
        phone: '',
        organizationtype: '',
        organizationtypeother: '',
        registeredorgname: '',
        founders: '',
        foundercontact: '',
        country: '',
        state: '',
        city: '',
        visitaddress: '',
        locationlink: '',
        website: '',
        sociallinks: '',
        hostingdeclaration: false,
        eligibilitydeclaration: false,
        informationdeclaration: false,
        sharingdetailsdeclaration: false,
        socialmediaconsentdeclaration: false,
        agreetab0: false,
        agreetab1: false,
        numcows: '',
        numbullsoxencalves: '',
        area: '',
        visitorcapacity: '',
        teammembers: '',
        volunteers: '',
        otheractivities: '',
        uniqueinitiative: '',
        awards: '',
        participation: '',
        eventdays: '',
        customdays: '',
        customdaysreason: '',
        visittimingtype: '',
        alldayfrom: '',
        alldayto: '',
        slotmorningfrom: '',
        slotmorningto: '',
        slotafternoonfrom: '',
        slotafternoonto: '',
        sloteveningfrom: '',
        sloteveningto: '',
        activitiesonsite: [],
        activitiesonsiteother: '',
        activitieslocality: [],
        activitieslocalityother: '',
      });
      setTab0Scrolled(false);
      setTab1Scrolled(false);
    }
  };

  const canProceed = formData.agreetab0 && formData.agreetab1;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <b>Registration Form</b>
      </h1>
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
      {warning && (
        <div
          style={{
            ...styles.message,
            backgroundColor: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeeba',
            marginBottom: 16,
          }}
        >
          {warning}
        </div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
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
                      name="agreetab0"
                      checked={formData.agreetab0}
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
                      name="agreetab1"
                      checked={formData.agreetab1}
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
              style={{
                ...styles.button,
                backgroundColor: !canProceed ? '#cccccc' : styles.button.backgroundColor,
                cursor: !canProceed ? 'not-allowed' : 'pointer',
              }}
              disabled={!canProceed}
            >
              Proceed to Registration
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>We are a –</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: '10px' }}>
                {['Sanctuary', 'Rescue Center', 'Cruelty-free Dairy Farm', 'Farm Community', 'Others'].map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name="organizationtype"
                      value={type}
                      checked={formData.organizationtype === type}
                      onChange={handleChange}
                      required
                      style={{ marginRight: 8 }}
                    />
                    {type}
                  </label>
                ))}
              </div>
              {formData.organizationtype === 'Others' && (
                <input
                  type="text"
                  name="organizationtypeother"
                  value={formData.organizationtypeother || ''}
                  onChange={handleChange}
                  placeholder="Please mention"
                  style={styles.input}
                  required
                />
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name of your Registered Organization:</label>
              <input
                ref={registeredorgnameRef}
                type="text"
                name="registeredorgname"
                value={formData.registeredorgname}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.registeredorgname ? 'red' : '#ccc'
                }}
              />
              {errors.registeredorgname && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.registeredorgname}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name of the Founder(s), Trustee(s), Owner(s):</label>
              <input
                type="text"
                name="founders"
                value={formData.founders}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contact details of any one of the Founder/Trustee/Owner:</label>
              <input
                type="text"
                name="foundercontact"
                value={formData.foundercontact}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Country:</label>
              <input
                ref={countryRef}
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.country ? 'red' : '#ccc'
                }}
              />
              {errors.country && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.country}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State / Province:</label>
              <input
                ref={stateRef}
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.state ? 'red' : '#ccc'
                }}
              />
              {errors.state && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.state}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>City / Town / Village:</label>
              <input
                ref={cityRef}
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.city ? 'red' : '#ccc'
                }}
              />
              {errors.city && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.city}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address for visit:</label>
              <input
                ref={visitaddressRef}
                type="text"
                name="visitaddress"
                value={formData.visitaddress}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.visitaddress ? 'red' : '#ccc'
                }}
              />
              {errors.visitaddress && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.visitaddress}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location link:</label>
              <input
                type="text"
                name="locationlink"
                value={formData.locationlink}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email ID:</label>
              <input
                ref={emailRef}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.email ? 'red' : '#ccc'
                }}
              />
              {errors.email && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.email}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone No.:</label>
              <input
                ref={phoneRef}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  borderColor: errors.phone ? 'red' : '#ccc'
                }}
              />
              {errors.phone && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.phone}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Website link:</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Social Media links:</label>
              <input
                type="text"
                name="sociallinks"
                value={formData.sociallinks}
                onChange={handleChange}
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
              onClick={() => setStep((prev) => prev + 1)}
              style={styles.button}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Cows:</label>
              <input
                ref={numcowsRef}
                type="number"
                name="numcows"
                value={formData.numcows}
                onChange={handleChange}
                min="0"
                required
                style={{
                  ...styles.input,
                  borderColor: errors.numcows ? 'red' : '#ccc'
                }}
              />
              {errors.numcows && (
                <div style={{ color: 'red', fontSize: '0.95em' }}>{errors.numcows}</div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Bulls, Oxen, Calves:</label>
              <input
                type="number"
                name="numbullsoxencalves"
                value={formData.numbullsoxencalves}
                onChange={handleChange}
                min="0"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Area of the sanctuary:</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Number of visitors (approx) I can (or wish to) accommodate in a day:</label>
              <input
                type="number"
                name="visitorcapacity"
                value={formData.visitorcapacity}
                onChange={handleChange}
                min="0"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>No of Team Members you can involve for organizing the event:</label>
              <input
                type="number"
                name="teammembers"
                value={formData.teammembers}
                onChange={handleChange}
                min="0"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>No of Volunteers you can involve for any support / services required during the event:</label>
              <input
                type="number"
                name="volunteers"
                value={formData.volunteers}
                onChange={handleChange}
                min="0"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Other activities your organization is involved with along with cow care:</label>
              <textarea
                name="otheractivities"
                value={formData.otheractivities}
                onChange={handleChange}
                style={styles.input}
                rows={2}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Any unique initiative you have taken for cow care:</label>
              <textarea
                name="uniqueinitiative"
                value={formData.uniqueinitiative}
                onChange={handleChange}
                style={styles.input}
                rows={2}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Any awards/recognition received by your organization:</label>
              <textarea
                name="awards"
                value={formData.awards}
                onChange={handleChange}
                style={styles.input}
                rows={2}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Any participation in any event, conference, summit promoting cow care:</label>
              <textarea
                name="participation"
                value={formData.participation}
                onChange={handleChange}
                style={styles.input}
                rows={2}
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
              onClick={() => setStep((prev) => prev + 1)}
              style={styles.button}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>I wish to host the World Cows Day 2025 Event –</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="eventdays"
                    value="all"
                    checked={formData.eventdays === 'all'}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  On All Days - 15th Aug 2025 to 01st Sep 2025.
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="eventdays"
                    value="custom"
                    checked={formData.eventdays === 'custom'}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  On Custom Days -
                </label>
                <input
                  type="text"
                  name="customdays"
                  value={formData.customdays}
                  onChange={handleChange}
                  placeholder="Enter custom days (01st Sep 2025 is mandatory)"
                  style={{ ...styles.input, marginTop: 8, marginBottom: 8 }}
                  disabled={formData.eventdays !== 'custom'}
                />
                <input
                  type="text"
                  name="customdaysreason"
                  value={formData.customdaysreason}
                  onChange={handleChange}
                  placeholder="Reason for not hosting all days"
                  style={styles.input}
                  disabled={formData.eventdays !== 'custom'}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>I wish to confirm the below visit timings on the days selected above –</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="visittimingtype"
                    value="all"
                    checked={formData.visittimingtype === 'all'}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  All Day – Timings:
                </label>
                <span style={{ marginLeft: 12 }}>
                  From <input
                    type="time"
                    name="alldayfrom"
                    value={formData.alldayfrom}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                    disabled={formData.visittimingtype !== 'all'}
                  />
                  To <input
                    type="time"
                    name="alldayto"
                    value={formData.alldayto}
                    onChange={handleChange}
                    disabled={formData.visittimingtype !== 'all'}
                  />
                </span>
              </div>
              <div style={{ marginTop: 10 }}>
                <label>
                  <input
                    type="radio"
                    name="visittimingtype"
                    value="slot"
                    checked={formData.visittimingtype === 'slot'}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  Selected slot – Timings:
                </label>
                <div style={{ marginLeft: 24, marginTop: 6 }}>
                  Morning - From <input
                    type="time"
                    name="slotmorningfrom"
                    value={formData.slotmorningfrom}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                    disabled={formData.visittimingtype !== 'slot'}
                  />
                  To <input
                    type="time"
                    name="slotmorningto"
                    value={formData.slotmorningto}
                    onChange={handleChange}
                    disabled={formData.visittimingtype !== 'slot'}
                  />
                </div>
                <div style={{ marginLeft: 24, marginTop: 6 }}>
                  Afternoon - From <input
                    type="time"
                    name="slotafternoonfrom"
                    value={formData.slotafternoonfrom}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                    disabled={formData.visittimingtype !== 'slot'}
                  />
                  To <input
                    type="time"
                    name="slotafternoonto"
                    value={formData.slotafternoonto}
                    onChange={handleChange}
                    disabled={formData.visittimingtype !== 'slot'}
                  />
                </div>
                <div style={{ marginLeft: 24, marginTop: 6 }}>
                  Evening - From <input
                    type="time"
                    name="sloteveningfrom"
                    value={formData.sloteveningfrom}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                    disabled={formData.visittimingtype !== 'slot'}
                  />
                  To <input
                    type="time"
                    name="sloteveningto"
                    value={formData.sloteveningto}
                    onChange={handleChange}
                    disabled={formData.visittimingtype !== 'slot'}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Types of activities we wish to conduct for visitors within the sanctuary/farm during the event on our selected days of participation:
              </label>
              <div>
                {['Sanctuary/Farm visit', 'Cow cuddling', 'Cow feeding', 'Cow Talk', 'Cow community service', 'Cow milking'].map((activity) => (
                  <label key={activity} style={{ marginRight: 18 }}>
                    <input
                      type="checkbox"
                      name="activitiesonsite"
                      value={activity}
                      checked={formData.activitiesonsite.includes(activity)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          activitiesonsite: checked
                            ? [...prev.activitiesonsite, activity]
                            : prev.activitiesonsite.filter((a) => a !== activity),
                        }));
                      }}
                    />
                    {activity}
                  </label>
                ))}
                <label>
                  <input
                    type="checkbox"
                    name="activitiesonsite"
                    value="Others"
                    checked={formData.activitiesonsite.includes('Others')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        activitiesonsite: checked
                          ? [...prev.activitiesonsite, 'Others']
                          : prev.activitiesonsite.filter((a) => a !== 'Others'),
                      }));
                    }}
                  />
                  Others (please specify)
                </label>
                {formData.activitiesonsite.includes('Others') && (
                  <input
                    type="text"
                    name="activitiesonsiteother"
                    value={formData.activitiesonsiteother}
                    onChange={handleChange}
                    placeholder="Example – Cow based - Sanctuary Tour, Kids Games, School Educational Activities, College Trips, etc."
                    style={styles.input}
                  />
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Types of cow-based activities we wish to organize in your locality anytime during the celebration period from 15-Aug-25 to 01-Sep-25:
              </label>
              <div>
                {['Cow Conferences', 'Value based education', 'Seminars in School / Colleges', 'Group excursions', 'Inviting leaders/celebrities etc for the event', 'Social awareness', 'Debate competition'].map((activity) => (
                  <label key={activity} style={{ marginRight: 18 }}>
                    <input
                      type="checkbox"
                      name="activitieslocality"
                      value={activity}
                      checked={formData.activitieslocality.includes(activity)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          activitieslocality: checked
                            ? [...prev.activitieslocality, activity]
                            : prev.activitieslocality.filter((a) => a !== activity),
                        }));
                      }}
                    />
                    {activity}
                  </label>
                ))}
                <label>
                  <input
                    type="checkbox"
                    name="activitieslocality"
                    value="Others"
                    checked={formData.activitieslocality.includes('Others')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        activitieslocality: checked
                          ? [...prev.activitieslocality, 'Others']
                          : prev.activitieslocality.filter((a) => a !== 'Others'),
                      }));
                    }}
                  />
                  Others (please specify)
                </label>
                {formData.activitieslocality.includes('Others') && (
                  <input
                    type="text"
                    name="activitieslocalityother"
                    value={formData.activitieslocalityother}
                    onChange={handleChange}
                    placeholder="Please specify"
                    style={styles.input}
                  />
                )}
              </div>
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
              onClick={() => setStep((prev) => prev + 1)}
              style={styles.button}
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ marginBottom: 16, fontSize: '1.5rem' }}>Review Your Information</h2>
            <div style={styles.reviewContainer}>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} style={styles.reviewRow}>
                  <strong style={styles.reviewLabel}>{key.replace(/([A-Z])/g, ' $1')}: </strong>
                  <span style={styles.reviewValue}>
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              background: '#f6f8fa',
              border: '1px solid #e2e2e2',
              borderRadius: '7px',
              padding: '18px',
              marginBottom: '22px',
              fontSize: '1.02rem',
              color: '#333'
            }}>
              <b>NB –</b>
              <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 22 }}>
                <li>
                  The event is expected to be celebrated by the host on all days from 15th Aug to 01st Sep 2025, however, due to genuine reason if the same is not possible then only the host is required to host the event on customized days.
                </li>
                <li>
                  Information about your organization is required to validate that the host is an authorized government recognized registered organization.
                </li>
                <li>
                  Your address and location details as required will be visible on the location map to the participants visiting your sanctuary/farm for the World Cow Day event.
                </li>
                <li>
                  Please ensure to take care of all safety measures and crowd management.
                </li>
                <li>
                  Ensure safety of children from cows/calves or any other animals present in the sanctuary/farm.
                </li>
                <li>
                  Please ensure sufficient facilities are available like parking, restrooms, etc. for the visitors.
                </li>
                <li>
                  Please ensure sufficient facilities for senior citizens or differently abled visitors (if any).
                </li>
                <li>
                  Post submission of the registration form, you will receive the hosting badge for World Cow Day event.
                </li>
              </ul>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Declarations (please check all to submit):</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="hostingdeclaration"
                    checked={formData.hostingdeclaration}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  I am interested in hosting the World Cow Day event as per the guidelines of the event.
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="eligibilitydeclaration"
                    checked={formData.eligibilitydeclaration}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  I agree with the eligibility criteria for hosting the World Cow Day event.
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="informationdeclaration"
                    checked={formData.informationdeclaration}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  I confirm all the information provided is true.
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="sharingdetailsdeclaration"
                    checked={formData.sharingdetailsdeclaration}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  I give my consent to share my sanctuary details with the participants during the World Cow Day event through the World Cow Day website.
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="socialmediaconsentdeclaration"
                    checked={formData.socialmediaconsentdeclaration}
                    onChange={handleChange}
                    required
                    style={{ marginRight: 8 }}
                  />
                  I give my consent to use the content that will be posted by us on our social media handles during the World Cow Day Event for promotion of World Cow Day activities.
                </label>
              </div>
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
    maxWidth: '900px',
    minHeight: '80vh',
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
  reviewContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '20px',
  },
  reviewRow: {
    marginBottom: '12px',
    fontSize: '1.05rem',
  },
  reviewLabel: {
    fontWeight: 'bold',
  },
  reviewValue: {
    marginLeft: '8px',
    color: '#333',
  },
};