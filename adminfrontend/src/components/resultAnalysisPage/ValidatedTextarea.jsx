import React, { useState, useEffect } from 'react';

const ValidatedTextarea = ({type,name, value, onChange, setError }) => {
  const [hasError, setHasError] = useState(false);

  const handleValidation = (newValue) => {
    // Check if the value is empty or undefined
    if (!newValue || newValue.trim() === '') {
      if (!hasError) {
        setError((prev)=>{
            return {...prev,[name]:true}
        }); // Increment error count
        setHasError(true); // Mark this input as having an error
      }
    } else {
      if (hasError) {
        setError((prev)=>{
            return {...prev,[name]:false}
        }); // Increment error count
        setHasError(false); // Clear the error for this input
      }
    }

  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue); // Pass updated value to parent
    handleValidation(newValue);
  };

  useEffect(() => {
    // Initialize validation state when component mounts

    handleValidation(value);
  }, []); // Run only on initial mount

  return (
    <textarea
      type={type}
      value={value || ''} // Default value to avoid uncontrolled input warning
      onChange={handleChange}
      style={{
        borderColor: hasError ? 'red' : 'green',
        borderWidth: '2px',
        borderRadius: '5px',
        padding: '8px',
      }}
    />
  );
};

export default ValidatedTextarea;
