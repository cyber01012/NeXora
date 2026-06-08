import React, { createContext, useState, useContext, useEffect } from 'react';

const DisasterContext = createContext();

export const useDisasterMode = () => useContext(DisasterContext);

export const DisasterProvider = ({ children }) => {
  const [isDisasterMode, setIsDisasterMode] = useState(false);

  const toggleDisasterMode = () => {
    setIsDisasterMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDisasterMode) {
      document.body.classList.add('disaster-mode');
    } else {
      document.body.classList.remove('disaster-mode');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('disaster-mode');
    };
  }, [isDisasterMode]);

  return (
    <DisasterContext.Provider value={{ isDisasterMode, toggleDisasterMode }}>
      {children}
    </DisasterContext.Provider>
  );
};
