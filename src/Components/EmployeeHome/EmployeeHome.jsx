import React from 'react';
import { Card, Button, Avatar, Timeline, Divider } from 'antd';
import { EnvironmentOutlined,PhoneOutlined,UserOutlined, CarOutlined, LockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './EmployeeHome.css';
import { useNavigate } from 'react-router-dom';



const EmployeeHome = () => {
  const navigate = useNavigate();

  return (
    <div className="trip-tracker-container">
      {/* User Location Section */}
      <div className="user-location">
        <Avatar src="https://res.cloudinary.com/dlo7urgnj/image/upload/v1725302479/IMG_20220923_220919_zjzuye.jpg" size={50} />
        <div style={{width:"50vw"}}>
          <p>Gents PG</p>
          <p>12, Kambar Street, Alandur, Chennai</p>
        </div>
        <UserOutlined />
      </div>

      {/* Map and Trip Info */}
      <Card className="map-card">
        <div className="map-placeholder">
          <img src="https://res.cloudinary.com/dlo7urgnj/image/upload/v1725507873/Product-Selector_okdnkh.png" alt="map" className="map-image" />
          {/* <div className="distance-info"> */}
            {/* <p>200 m . 5 min</p> */}
            {/* <p>12 Km . 40 min</p> */}
          {/* </div> */}
        </div>
        
        {/* Trip Info */}
        <div className="trip-info">
          <h4>Trip ID : ABCDE123455</h4>
          <span className="status-tag waiting">Waiting</span>
          <Divider />
          <div className="trip-details">
            <p><ClockCircleOutlined /> Today, 01 Jan 23, 10:00am</p>
            <p><CarOutlined /> TN 01 AB 1234</p>
            <p><UserOutlined/> Ezio Auditore</p>
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
          <Button className="otp-button" type="primary">OTP : 123456</Button>
          <Button className="call-button" icon={<PhoneOutlined style={{ transform: 'scaleX(-1)' }}/>} type="primary">Call Driver</Button>
        </div>
      </Card>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
       <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Button icon={<CarOutlined />} onClick={()=>navigate('/createtrips')}/> <p style={{textAlign:"center"}}>Employee <br /> Schedule</p>
        </div>
        {/* <div  style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Button icon={<LockOutlined />} onClick={()=>navigate('/createtrips')} /> <p style={{textAlign:"center"}}>Create Trips</p>
          </div>  */}
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Button icon={<EnvironmentOutlined />} onClick={()=>navigate('/upcomingtrips')} /> <p style={{textAlign:"center"}}>Upcoming <br /> Trips</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <Button icon={<ClockCircleOutlined />} onClick={()=>navigate('/triphistory')}/> <p style={{textAlign:"center"}}>Trip <br /> History</p>
          </div>
      </div>
    </div>
  )
}

export default EmployeeHome