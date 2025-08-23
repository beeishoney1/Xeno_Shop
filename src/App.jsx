import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav'; // Adjust path if needed
import Home from './components/Home'; // Adjust path if needed
import AdminComponent from './components/AdminComponent';
import Uc from './components/Uc';
import GreetingScreen from './components/GreetingScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<GreetingScreen />} />
          <Route path="/pubgaccount" element={<Home />} />
          <Route path="/home" element={<Home />} /> {/* Default route */}
          <Route path="/admindashboard" element={<AdminComponent />} />
          <Route path="/uc" element={<Uc/>}/>
        </Routes>
      </div>
  </Router>
  );
}

export default App;