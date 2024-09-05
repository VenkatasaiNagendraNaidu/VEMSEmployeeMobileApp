import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeRegistration = () => {
  const [empName, setEmpName] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleRegistration = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
    const newEmployee = { empName, empId, password, location };

    employeeLog.push(newEmployee);
    localStorage.setItem('employeeLog', JSON.stringify(employeeLog));

    alert('Registration successful!');
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div>
      <h3>Employee Registration</h3>
      <div>
        <input
          type="text"
          placeholder="Employee Name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Stay Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
};

export default EmployeeRegistration;
