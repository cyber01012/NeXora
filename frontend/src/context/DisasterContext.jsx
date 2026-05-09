import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import alertSound from '../assets/audio/alertmode.mp3';

const DisasterContext = createContext();

export const useDisasterMode = () => useContext(DisasterContext);

export const DisasterProvider = ({ children }) => {
  const [isDisasterMode, setIsDisasterMode] = useState(false);
  const audioRef = useRef(null);

  // Create the Audio object once
  useEffect(() => {
    audioRef.current = new Audio(alertSound);
    audioRef.current.volume = 0.85;
    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleDisasterMode = () => {
    setIsDisasterMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDisasterMode) {
      document.body.classList.add('disaster-mode');
      // Play the alert voice
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // rewind in case it was played before
        audioRef.current.play().catch((e) => {
          console.warn('Audio play was blocked:', e);
        });
      }
    } else {
      document.body.classList.remove('disaster-mode');
      // Stop audio if it's still playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
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
