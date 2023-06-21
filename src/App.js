import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home} from './routes/home.js';
import {Socials} from './routes/socials.js';
import {Header} from './header/index.js';

const engine = new Styletron();

export default function App() {
  return (
    <StyletronProvider value={engine}>
    <main>
      <Router>
      <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/socials' element={<Socials />} />
        </Routes>
      </Router>
    </main>
    </StyletronProvider>
  )
}
