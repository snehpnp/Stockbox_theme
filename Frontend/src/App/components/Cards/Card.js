import React from 'react';



const GradientCard = () => {
  const cardStyle = {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  
    padding: '20px',
    textAlign: 'center',
    maxWidth: '300px',
    margin: '20px auto',
    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
    cursor: 'pointer'
  };

  const cardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
  };

  const buttonStyle = {
    background: 'white',
 
    border: 'none',
    padding: '8px 16px',
    fontSize: '1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background 0.3s ease, color 0.3s ease'
  };

  const buttonHoverStyle = {
    background: '#4facfe',
  
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = cardHoverStyle.transform;
        e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Gradient Card</h2>
      <p style={{ fontSize: '1rem', marginBottom: '20px' }}>
        This is an example of a card with a beautiful gradient background.
      </p>
      <button
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = buttonHoverStyle.background;
          e.currentTarget.style.color = buttonHoverStyle.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = buttonStyle.background;
          e.currentTarget.style.color = buttonStyle.color;
        }}
      >
        Learn More
      </button>
    </div>
  );
};

export default GradientCard;
