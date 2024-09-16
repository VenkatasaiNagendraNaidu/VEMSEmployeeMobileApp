import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Avatar, Timeline, Divider, Modal, Form, Input, message } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, UserOutlined, CarOutlined, ClockCircleOutlined, LogoutOutlined,CarryOutOutlined,  MailOutlined, ManOutlined, WomanOutlined,SolutionOutlined } from '@ant-design/icons';
import './EmployeeHome.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const EmployeeHome = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [form] = Form.useForm(); // Use form instance

  const fetchEmployeeDetails = async () => {
    const empId = Cookies.get('EmployeeID');
    
    if (empId) {
      try {
        const response = await axios.get(`http://localhost:5000/emp/showemployee/${empId}`);
        setEmployee(response.data[0]);
      } catch (error) {
        console.error("Error fetching employee details", error);
      }
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  // Logout function to clear cookies and navigate to login page
  const handleLogout = () => {
    Cookies.remove('EmployeeID', { path: '/' });
    navigate('/'); 
  };

  // Show modal for password change
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Clear form fields when modal is closed
  };

  // Handle form submission for password change
  const handleChangePassword = async (values) => {
    const empId = Cookies.get('EmployeeID');
    const { oldPassword, newPassword } = values;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/emp/change-password', {
        employeeId: empId,
        oldPassword,
        newPassword
      });

      if (response.status === 200) { // Check for success status
        message.success("Password changed successfully");
        setIsModalVisible(false);
        form.resetFields(); // Clear form fields after success
      }
    } catch (error) {
      if (error.response) {
        // Handle specific errors based on the status code returned by the backend
        if (error.response.status === 401) {
          message.error("Incorrect old password");
        } else if (error.response.status === 404) {
          message.error("Employee not found");
        } else if (error.response.status === 500) {
          message.error("Server error. Please try again later.");
        } else {
          message.error("Error changing password");
        }
      } else {
        message.error("Error changing password");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle profile view
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!employee) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="trip-tracker-container">
      {/* Header Section*/}
      <div className="header-section">
        <div className="user-location">
          <Avatar src={employee.employeeImage} size={50} />
          <div style={{ width: "60%", marginLeft: "15px" }}>
            <p style={{lineHeight:"1.6"}}><UserOutlined /><strong> {employee.employeeName}</strong></p>
          </div>
          <div style={{display:"flex", flexDirection: "column"}}>
            <Button 
              icon={<SolutionOutlined />} 
              type="primary" 
              onClick={toggleProfile} 
              style={{scale:"0.8",border:"black", boxShadow:"none",alignSelf:"flex-end", backgroundColor: "#27292a"}}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      {showProfile && (
        <div className="profile-card">
          <Card title="Employee Profile" bordered={false} style={{ width: '100%', marginBottom:"20px"}}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom:"10px"}}>
            <Avatar size={100} src={employee.employeeImage} style={{justifySelf:"center"}}/>
            <div style={{display:"flex", flexDirection: "column", justifyContent:"space-around"}}>
              <Button
                icon={<LogoutOutlined />}
                type="link"
                onClick={handleLogout}
                style={{alignSelf:"flex-end", color:"#27292a"}}
              >
                Logout
              </Button>
              <Button style={{scale:"0.8", backgroundColor:"#27292a", border:"black", boxShadow:"none"}} type="primary" onClick={showModal}>Change Password</Button>
            </div>
            </div>
            <p><strong>Employee ID: </strong>{employee.employeeId}</p>
            <p><strong>Name: </strong>{employee.employeeName} ( {employee.employeeGender.toLowerCase() === 'male' ? <ManOutlined /> : <WomanOutlined />} )</p>
            <p><MailOutlined /> <strong>E-mail: </strong>{employee.employeeEmail}</p>
            <p><PhoneOutlined /> <strong>Contact: </strong>{employee.employeeContact}</p>
            <p><PhoneOutlined /> <strong>Emergency Contact: </strong>{employee.employeeEmergencyContact}</p>
            <p><EnvironmentOutlined /> <strong>Address: </strong>{employee.employeeAddress}, {employee.employeeCity}</p>
            <p><EnvironmentOutlined /> <strong>Office Address: </strong>The Hive, OMR, Chennai</p>
          </Card>
        </div>
      )}


      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{width:"100%"}}
        >
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[{ required: true, message: 'Please enter your old password' }]}
          >
            <Input.Password placeholder="Enter old password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Change
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Map and Trip Info */}
      <Card className="map-card">
        <div className="map-placeholder">
          <img src="https://res.cloudinary.com/dlo7urgnj/image/upload/v1725507873/Product-Selector_okdnkh.png" alt="map" className="map-image" />
        </div>

        {/* Trip Info */}
        <div className="trip-info">
          <h4>Trip ID : ABCDE123455</h4>
          <span className="status-tag waiting">Waiting</span>
          <Divider />
          <div className="trip-details">
            <p><ClockCircleOutlined /> Today, 01 Jan 23, 10:00am</p>
            <p><CarOutlined /> TN 01 AB 1234</p>
            <p><UserOutlined /> Ezio Auditore</p>
            <p><EnvironmentOutlined /> HCL, OMR</p>
          </div>
        </div>

        {/* Time Schedule */}
        <Timeline className="timeline">
          <Timeline.Item color="green">8:30am</Timeline.Item>
          <Timeline.Item color="blue">9:00am</Timeline.Item>
          <Timeline.Item color="pink">9:30am</Timeline.Item>
          <Timeline.Item color="red">10:00am</Timeline.Item>
        </Timeline>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button className="otp-button" type="primary">OTP: 123456</Button>
          <Button className="call-button" icon={<PhoneOutlined style={{ transform: 'scaleX(-1)' }} />} type="primary">Call Driver</Button>
        </div>
      </Card>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Button icon={<CarOutlined />} onClick={() => navigate('/createtrips')} />
          <p style={{ textAlign: "center" }}>Schedule <br /> Cab</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Button icon={<CarryOutOutlined />} onClick={() => navigate('/triprequests')} />
          <p style={{ textAlign: "center" }}>Cab <br /> Requests</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Button icon={<ClockCircleOutlined />} onClick={() => navigate('/triphistory')} />
          <p style={{ textAlign: "center" }}>My <br /> Trips</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;