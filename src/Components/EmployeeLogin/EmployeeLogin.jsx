import React, { useState } from 'react';
import { Form, Input, Button, Alert, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const EmployeeLogin = () => {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
      const response = await axios.post('http://localhost:5000/emp/login', { empId, password });
      const { id: EmployeeId } = response.data; // Destructuring EmployeeId sent from the backend
      
      // Set the EmployeeId in the cookie (no expiry)
      Cookies.set('EmployeeID', EmployeeId, { path: '/' });
      
      message.success("Login Successful");
      navigate('/dashboard');
    } catch (error) {
      message.error('Invalid credentials!');
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      console.log(empId);
      
      // Send a request to the backend to reset the password
      await axios.post('http://localhost:5000/emp/reset-password', { EmployeeId : empId });
      message.success('A new password has been sent to your email.');
    } catch (error) {
      message.error('Error sending reset password email.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, display: "flex", alignItems: "center", flexDirection: "column", marginTop:"20px", padding: "auto" }}>
      {/* <div className="logo">
          <img src="https://res.cloudinary.com/dlo7urgnj/image/upload/v1727276496/vemslogo_rsa3cx.png" alt="Logo" style={{height:"100px", width:"100px", margin:"0 10px"}}/>
        </div> */}
      <h3 style={{ textAlign: 'center' }}>Employee Login</h3>
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
      
      <Button
        type="link"
        onClick={handleResetPassword}
        disabled={!empId || loading}
      >
        {loading ? 'Sending reset link...' : 'Forgot Password?'}
      </Button>
    </div>
  );
};

export default EmployeeLogin;