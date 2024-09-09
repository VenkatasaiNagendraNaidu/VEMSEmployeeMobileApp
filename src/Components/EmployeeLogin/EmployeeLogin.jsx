import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const EmployeeLogin = () => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
      const response = await axios.post('http://localhost:5000/emp/login', { empId, password });
      const { id: EmployeeID } = response.data; // Destructuring EmployeeID sent from the backend
      
      // Set the EmployeeID in the cookie (no expiry)
      Cookies.set('EmployeeID', EmployeeID, { path: '/' });
      
      message.success("Login Successful");
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials!');
    }
    // const employeeLog = JSON.parse(localStorage.getItem('employeeLog')) || [];
    // const employee = employeeLog.find(emp => emp.empId === empId && emp.password === password);

    // if (employee) {
    //     message.success("Login Successful")
    //   navigate('/dashboard'); // Navigate to the dashboard page on successful login
    // } else {
    //   setError('Invalid credentials!');
    // }
  };

  return (
    <div style={{ maxWidth: 400,display:"flex",alignItems:"center",flexDirection:"column", margin: 'auto',padding :"auto" }}>
      <h3 style={{ textAlign: 'center' }}>Employee Login</h3>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
      <Form
        name="login"
        layout="vertical"
        onFinish={handleLogin}
      >
        <Form.Item
          label="Employee ID"
          name="empId"
          rules={[{ required: true, message: 'Please enter your Employee ID' }]}
        >
          <Input value={empId} onChange={(e) => setEmpId(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmployeeLogin;
