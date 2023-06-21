import React from 'react';
import { useEffect, useState } from 'react';
import {HeartbeatUrl} from '../constants.js';

export function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(HeartbeatUrl);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <main>
      <p>{message}</p>
    </main>
  )
}
