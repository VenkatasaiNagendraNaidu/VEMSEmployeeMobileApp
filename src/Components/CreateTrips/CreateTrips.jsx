import React, { useState, useEffect } from 'react';
import { Button, DatePicker, TimePicker, Modal, message } from 'antd';
import { LeftOutlined, BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const CreateTrips = () => {
  const navigate = useNavigate();
  
  // State to hold selected values
  const [routine, setRoutine] = useState('Pickup');
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [date, setDate] = useState(moment()); // Set default to today
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const empId = Cookies.get('EmployeeID'); // Get EmployeeID from cookies

  // Handle button click for routine
  const handleRoutineClick = (routineOption) => {
    setRoutine(routineOption);
    // Reset times when routine changes
    if (routineOption === 'Pickup') {
      setOutTime(null);
    } else if (routineOption === 'Drop') {
      setInTime(null);
    }
  };

  // Handle time picker change
  const handleTimeChange = (time, type) => {
    if (type === 'in') {
      setInTime(time);
    } else {
      setOutTime(time);
    }
  };

  // Handle date picker change
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  // Enable or disable the Next button based on selections
  useEffect(() => {
    if (!routine || !date) {
      setIsNextDisabled(true);
      return;
    }

    if (routine === 'Pickup' && inTime) {
      setIsNextDisabled(false);
    } else if (routine === 'Drop' && outTime) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [routine, inTime, outTime, date]);

  // Send data to backend on 'Next' button click
  const handleNextClick = async () => {
    if (!empId) {
      message.error('Employee ID not found. Please log in again.');
      return;
    }

    const tripData = {
      EmployeeID: empId,
      date: date.format('YYYY-MM-DD'),
      inTime: routine === 'Pickup' && inTime ? inTime.format('HH:mm:ss') : null,
      outTime: routine === 'Drop' && outTime ? outTime.format('HH:mm:ss') : null,
    };

    try {
      const response = await axios.post('http://localhost:5000/emp/trips', tripData);
      console.log(response.data);
      setIsModalVisible(true); // Show confirmation modal
    } catch (error) {
      console.error('Error creating/updating trip:', error);
      message.error('Failed to place cab request. Please try again.');
    }
  };

  // Close the modal when "Done" is clicked
  const handleDone = () => {
    setIsModalVisible(false);
    navigate('/dashboard'); // Navigate back to dashboard or another route
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
      {/* Header with Back Button and Notification */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} style={{ fontSize: '20px', cursor: 'pointer' }} />
        <h3>Create Trips</h3>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </div>

      {/* Routine */}
      <div style={{ marginTop: '20px' }}>
        <p>Routine</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: '100%' }}>
          {['Pickup', 'Drop'].map(option => (
            <Button
              key={option}
              onClick={() => handleRoutineClick(option)}
              style={{ 
                color: routine === option ? 'white' : '', 
                backgroundColor: routine === option ? 'rgb(24, 144, 255)' : '',
                width: '100px'
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Time Picker */}
      <div style={{ marginTop: '20px' }}>
        {routine === 'Pickup' && (
          <div>
            <p>In Time</p>
            <TimePicker
              value={inTime}
              format={'h:mm A'}
              onChange={(time) => handleTimeChange(time, 'in')}
              style={{ width: '100%' }}
            />
          </div>
        )}
        
        {routine === 'Drop' && (
          <div>
            <p>Out Time</p>
            <TimePicker
              value={outTime}
              format={'h:mm A'}
              onChange={(time) => handleTimeChange(time, 'out')}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Date Picker */}
      <div style={{ marginTop: '20px' }}>
        <p>Date Of Schedule</p>
        <DatePicker
          style={{ width: '100%' }}
          value={date}
          onChange={handleDateChange}
        />
      </div>

      {/* Next Button */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          type="primary" 
          style={{ width: '100px' }} 
          onClick={handleNextClick}
          disabled={isNextDisabled}
        >
          Next
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CheckCircleOutlined style={{ fontSize: '64px', color: 'green', animation: 'bounce 1s infinite' }} />
          <h2>Cab Request Placed Successfully!</h2>
          <p><strong>Routine:</strong> {routine}</p>
          <p><strong>Date:</strong> {date ? date.format('YYYY-MM-DD') : 'Not selected'}</p>
          {routine === 'Pickup' && <p><strong>In Time:</strong> {inTime ? inTime.format('h:mm A') : 'Not selected'}</p>}
          {routine === 'Drop' && <p><strong>Out Time:</strong> {outTime ? outTime.format('h:mm A') : 'Not selected'}</p>}
          <Button type="primary" onClick={handleDone} style={{ marginTop: '20px', width: '100px' }}>
            Done
          </Button>
        </div>
      </Modal>

      {/* CSS for animated tick mark */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CreateTrips;