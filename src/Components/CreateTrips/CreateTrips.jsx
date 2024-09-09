import React, { useState } from 'react';
import { Button, DatePicker, TimePicker, Modal } from 'antd';
import { LeftOutlined, BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const CreateTrips = () => {
  const navigate = useNavigate();
  
  // State to hold selected values
  const [selectedDay, setSelectedDay] = useState('');
  const [routine, setRoutine] = useState('');
  const [inTime, setInTime] = useState(moment('10:00 AM', 'h:mm A'));
  const [outTime, setOutTime] = useState(moment('7:00 PM', 'h:mm A'));
  const [date, setDate] = useState(moment('2023-09-29', 'YYYY-MM-DD'));
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle button click for routine
  const handleRoutineClick = (routineOption) => {
    setRoutine(routineOption);
  };

  // Handle time picker change
  const handleTimeChange = (time, timeString, type) => {
    if (type === 'in') {
      setInTime(time);
    } else {
      setOutTime(time);
    }
  };

  // Handle date picker change
  const handleDateChange = (date) => {
    setDate(date);
  };

  // Log values on 'Next' button click and show confirmation modal
  const handleNextClick = () => {
    setIsModalVisible(true); // Show confirmation modal
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
        <LeftOutlined onClick={() => navigate('/dashboard')} />
        <h3>Create Trips</h3>
        <BellOutlined />
      </div>

      {/* Routine */}
      <div style={{ marginTop: '20px' }}>
        <p>Routine</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: '100%' }}>
          {['Pickup', 'Drop'].map(option => (
            <Button
              key={option}
              onClick={() => handleRoutineClick(option)}
              style={{ color: routine === option ? 'white' : '', backgroundColor: routine === option ? 'rgb(24, 144, 255)' : '' }}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Check-In and Check-Out based on routine */}
      <div style={{ marginTop: '20px' }}>
        {routine === 'Pickup' && (
          <div>
            <p>In Time</p>
            <TimePicker
              defaultValue={inTime}
              format={'h:mm A'}
              onChange={(time, timeString) => handleTimeChange(time, timeString, 'in')}
            />
          </div>
        )}
        
        {routine === 'Drop' && (
          <div>
            <p>Out Time</p>
            <TimePicker
              defaultValue={outTime}
              format={'h:mm A'}
              onChange={(time, timeString) => handleTimeChange(time, timeString, 'out')}
            />
          </div>
        )}
      </div>

      {/* Calendar */}
      <div style={{ marginTop: '20px' }}>
        <p>Date Of Schedule</p>
        <DatePicker
          fullscreen={false}
          style={{ width: '100%' }}
          defaultValue={date}
          onChange={handleDateChange}
        />
      </div>

      {/* Next Button */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button type="primary" style={{ width: '100px' }} onClick={handleNextClick}>
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
          <h2>Cab Booking Confirmed!</h2>
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
