import React, { useState } from 'react';
import { Button, DatePicker, TimePicker } from 'antd';
import { LeftOutlined, BellOutlined } from '@ant-design/icons';
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

  // Handle button click for days
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

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

  // Log values on 'Next' button click
  const handleNextClick = () => {
    console.log('Selected Values:', {
      'Selected Day': selectedDay,
      'Routine': routine,
      'In Time': inTime ? inTime.format('h:mm A') : 'Not selected',
      'Out Time': outTime ? outTime.format('h:mm A') : 'Not selected',
      'Date': date ? date.format('YYYY-MM-DD') : 'Not selected',
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
      {/* Header with Back Button and Notification */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} />
        <h3>Create Trips</h3>
        <BellOutlined />
      </div>

      {/* Working Days */}
      <div style={{ marginTop: '20px' }}>
        <p>Working Days</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100%' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <Button
              key={day}
              onClick={() => handleDayClick(day)}
              // type={selectedDay === day ? 'primary' : 'default'}
              style={{ color: selectedDay === day ? 'white' : '', backgroundColor: selectedDay === day ? 'rgb(24, 144, 255)' : '' }}
            >
              {day}
            </Button>
          ))}
        </div>
      </div>

      {/* Routine */}
      <div style={{ marginTop: '20px' }}>
        <p>Routine</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: '100%' }}>
          {['Pickup', 'Drop', 'Both'].map(option => (
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

      {/* Check-In and Check-Out */}
      <div style={{ marginTop: '20px' }}>
        <p>In Time</p>
        <TimePicker
          defaultValue={inTime}
          format={'h:mm A'}
          onChange={(time, timeString) => handleTimeChange(time, timeString, 'in')}
        />
        <p style={{ marginTop: '20px' }}>Out Time</p>
        <TimePicker
          defaultValue={outTime}
          format={'h:mm A'}
          onChange={(time, timeString) => handleTimeChange(time, timeString, 'out')}
        />
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
    </div>
  );
};

export default CreateTrips;
