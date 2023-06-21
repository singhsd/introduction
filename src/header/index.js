import React from 'react';
import { Button } from "baseui/button";
import { Link } from 'react-router-dom';
import {PingComponent} from '../server-healthcheck.js';
import {NoteSender} from '../note-sender.js';

const containerStyle = {
  display: 'flex',
  gap: '10px', // Adjust the value to increase/decrease the space
  padding: '12px',
  backgroundColor: '#f2f2f2', // Light gray background color
  color: '#333', // Dark gray text color
  width: '100%', // Take up the full width of the parent container
};

export function Header() {
  return (
    <div style={containerStyle}>
        <Button>
          <Link to='/' style={{ color: 'white' }}>Home</Link>
        </Button>
        <Button>
          <Link to='/socials' style={{ color: 'white' }}>Socials</Link>
        </Button>
      <div style={{
        display: 'flex',
        gap: '10px',
        flexDirection: 'row',
        marginLeft: 'auto',
        paddingRight: '20px',
      }}>
        <NoteSender />
       <PingComponent />
      </div>
    </div>
  );
};