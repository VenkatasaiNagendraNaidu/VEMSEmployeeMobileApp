import React from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import EmployeeScheduler from './Components/EmployeeScheduler';
import EmployeeLogin from './Components/EmployeeLogin/EmployeeLogin';
import EmployeeHeader from './Components/EmployeeHeader';
import EmployeeHome from './Components/EmployeeHome/EmployeeHome';
import CreateTrips from './Components/CreateTrips/CreateTrips';
import TripHistory from './Components/TripHistory/TripHistory';
import CabRequests from './Components/CabRequests/CabRequests';
import HomePage from './Components/HomePage/HomePage';

const App = () => {
  const location = useLocation(); // get current route

  return (
    <>
      {location.pathname !== '/' && <EmployeeHeader />} {/* Conditionally render header */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<EmployeeLogin />} />
        <Route path="/dashboard" element={<EmployeeHome />} />
        <Route path="/createtrips" element={<CreateTrips />} />
        <Route path="/triprequests" element={<CabRequests />} />
        <Route path="/triphistory" element={<TripHistory />} />
        <Route path="/empschedule" element={<EmployeeScheduler />} />
      </Routes>
    </>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;