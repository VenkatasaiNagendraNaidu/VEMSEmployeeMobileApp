import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, List, Empty, Spin, message } from 'antd';
import { LeftOutlined, BellOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const { TabPane } = Tabs;

const CabRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');
  const [cabRequestData, setCabRequestData] = useState({ today: [], upcomingRequests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCabRequests = async () => {
      try {
        const employeeId = Cookies.get('EmployeeID');

        // Fetch trips and employee details
        const tripsResponse = await axios.get(`http://localhost:5000/emp/showtrips/${employeeId}`);
        const employeeResponse = await axios.get(`http://localhost:5000/emp/showemployee/${employeeId}`);

        const trips = tripsResponse.data;
        const employee = employeeResponse.data[0];
        
        const today = new Date();

        const classifiedData = {
          today: [],
          upcomingRequests: []
        };

        trips.forEach((trip) => {
          const tripDate = new Date(trip.date);
          const formattedTrip = {
            tripId: trip.id,
            date: formatDate(trip.date),
            routine: null,
            employeeAddress: `${employee.employeeAddress}, ${employee.employeeCity}`,
            officeAddress: "The Hive, SRP Stratford, OMR, Chennai", // static office address
            inTime: trip.inTime ? formatTime(trip.inTime) : "",
            outTime: trip.outTime ? formatTime(trip.outTime) : "",
            rawInTime: trip.inTime, // store raw time for comparison
            rawOutTime: trip.outTime, // store raw time for comparison
          };

          if (trip.inTime) {
            formattedTrip.routine = "Pickup";
            if (isSameDay(today, tripDate)) {
              classifiedData.today.push(formattedTrip);
            } else if (tripDate > today) {
              classifiedData.upcomingRequests.push(formattedTrip);
            }
          }

          if (trip.outTime) {
            const dropTrip = { ...formattedTrip, routine: "Drop" };
            if (isSameDay(today, tripDate)) {
              classifiedData.today.push(dropTrip);
            } else if (tripDate > today) {
              classifiedData.upcomingRequests.push(dropTrip);
            }
          }
        });

        setCabRequestData(classifiedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cab request details", error);
      }
    };

    fetchCabRequests();
  }, []);

  // Format a date into "02 Jan 23"
  const formatDate = (dateInput) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  // Format time into "02:00 PM"
  const formatTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
  
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,  // 12-hour format with AM/PM
    });
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if the request can be canceled (if less than 4 hours)
  const canCancelRequest = (tripDate,timeString) => {
    if (!timeString) return false;
    
    const [hours, minutes, seconds] = timeString.split(':');
    const requestTime = new Date(tripDate);
    requestTime.setHours(hours, minutes, seconds, 0);

    const currentTime = new Date();
    const diffInMilliseconds = requestTime - currentTime;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    console.log(requestTime,currentTime,diffInMilliseconds,diffInHours)

    return diffInHours >= 4; // Check if the time is at least 4 hours away
  };

  const handleCancelRequest = async (tripId, routine, index) => {
    try {
      const updateField = routine === 'Pickup' ? 'inTime' : 'outTime';
      const response = await axios.post(`http://localhost:5000/emp/canceltrip/${tripId}`, {
        [updateField]: null
      });
      console.log("index",index)
      const updatedData = { ...cabRequestData };
      updatedData[activeTab].splice(index, 1); // Remove the card
      setCabRequestData(updatedData);

      message.success('Request cancelled successfully');
    } catch (error) {
      console.error('Error canceling the trip', error);
      message.error('Failed to cancel request');
    }
  };

  // Get the data for the active tab
  const getTabData = () => {
    return cabRequestData[activeTab] || [];
  };

  const renderCabRequests = () => {
    const requests = getTabData();

    if (loading) {
      return <Spin />;
    }

    if (requests.length === 0) {
      return <Empty description="No requests placed" />;
    }

    return requests.map((request, index) => (
      <Card key={index} style={{ marginTop: '20px', borderRadius: '10px', borderColor: '#f0f0f0' }}>
        {/* Date and Routine */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{request.date}</span>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{request.routine}</span>
        </div>

        {/* Time */}
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
          {request.routine === 'Pickup' ? request.inTime : request.outTime}
        </div>

        {/* Addresses */}
        <List>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined style={{ color: 'green' }} />}
              title={<span>{request.routine === 'Pickup' ? request.employeeAddress : request.officeAddress}</span>}
              description={request.routine === 'Pickup' ? 'Employee Address' : 'Office Address'}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<EnvironmentOutlined style={{ color: 'red' }} />}
              title={<span>{request.routine === 'Pickup' ? request.officeAddress : request.employeeAddress}</span>}
              description={request.routine === 'Pickup' ? 'Office Address' : 'Employee Address'}
            />
          </List.Item>
        </List>

        {/* Cancel Button */}
        <Button 
          type="primary" 
          danger 
          style={{ borderRadius: '15px', marginTop: '10px', width: '100%' }} 
          disabled={!canCancelRequest(new Date(request.date), request.routine === 'Pickup' ? request.rawInTime : request.rawOutTime)}
          onClick={() => handleCancelRequest(request.tripId, request.routine, index)}
        >
          Cancel Request
        </Button>
      </Card>
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <h3>Cab Requests</h3>
        <BellOutlined />
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="today"
        centered
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane tab="Today" key="today" />
        <TabPane tab="Upcoming" key="upcomingRequests" />
      </Tabs>

      {/* Cab Requests Content */}
      {renderCabRequests()}
    </div>
  );
};

export default CabRequests;