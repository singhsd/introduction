import React, { useState, useEffect } from 'react';
import { Button } from 'baseui/button';
import {HealthCheck} from './constants.js';

const retryInterval = 3000;

export const PingComponent = () => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch(HealthCheck); // Replace with your backend URL
        if (response.ok) {
          setIsBackendAvailable(true);
        } else {
          setIsBackendAvailable(false);
        }
      } catch (error) {
        setIsBackendAvailable(false);
      }
    };

    const intervalId = setInterval(() => {
      pingBackend();
    }, retryInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      {isBackendAvailable ? (
        <Button title='Server is up!'>
          <span role="img" aria-label="Thumbs Up">
            👍
          </span>
        </Button>
      ) : (
        <Button title='Server is down!'>
          <span role="img" aria-label="Thumbs Down">
            👎
          </span>
        </Button>
      )}
    </div>
  );
};

