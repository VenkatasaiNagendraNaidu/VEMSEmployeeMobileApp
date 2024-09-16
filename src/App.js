import React from 'react';
import 'antd/dist/reset.css';
// import 'antd/dist/antd.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeScheduler from './Components/EmployeeScheduler';
import EmployeeLogin from './Components/EmployeeLogin/EmployeeLogin';
import EmployeeHeader from './Components/EmployeeHeader';
import EmployeeHome from './Components/EmployeeHome/EmployeeHome';
import CreateTrips from './Components/CreateTrips/CreateTrips';
import TripHistory from './Components/TripHistory/TripHistory';
import CabRequests from './Components/CabRequests/CabRequests';

const App = () => {
  return (
    <>
      <EmployeeHeader/>
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeLogin/>} />
        {/* <Route path="/" element={<EmployeeRegistration/>} /> */}
        <Route path="/dashboard" element={<EmployeeHome/>} />
        <Route path="/createtrips" element={<CreateTrips/>}/>
        <Route path="/triprequests" element={<CabRequests/>}/>
        <Route path="/triphistory" element={<TripHistory/>}/>
        <Route path="/empschedule" element={<EmployeeScheduler/>}/>
      </Routes>
    </Router>
    </>
  );
};

export default App;