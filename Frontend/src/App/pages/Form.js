import React, { useState } from 'react';

function DynamicForm() {
  // Form Field Configuration
  const formFields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter your phone number' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
    { 
      name: 'gender', 
      label: 'Gender', 
      type: 'select', 
      options: ['Male', 'Female', 'Other'] 
    },
    { 
      name: 'agree', 
      label: 'Agree to Terms & Conditions', 
      type: 'checkbox' 
    }
  ];

  // State for Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    agree: false,
  });

  // Handle Change Event
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form Submitted! Check the console for details.');
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center' }}>Dynamic Form</h2>
      <form onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{field.label}</label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Select</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name]}
                onChange={handleChange}
                style={{ marginRight: '5px' }}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
         
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default DynamicForm;
