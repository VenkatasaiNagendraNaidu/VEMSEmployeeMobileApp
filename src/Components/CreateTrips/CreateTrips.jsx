// import React, { useState, useEffect } from 'react';
// import { Button, DatePicker, TimePicker, Modal, message } from 'antd';
// import { LeftOutlined, BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const CreateTrips = () => {
//   const navigate = useNavigate();
  
//   // State to hold selected values
//   const [routine, setRoutine] = useState('Pickup');
//   const [inTime, setInTime] = useState(null);
//   const [outTime, setOutTime] = useState(null);
//   const [date, setDate] = useState(moment()); // Set default to today
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isNextDisabled, setIsNextDisabled] = useState(true);

//   const empId = Cookies.get('EmployeeID'); // Get EmployeeID from cookies

//   // Handle button click for routine
//   const handleRoutineClick = (routineOption) => {
//     setRoutine(routineOption);
//     // Reset times when routine changes
//     if (routineOption === 'Pickup') {
//       setOutTime(null);
//     } else if (routineOption === 'Drop') {
//       setInTime(null);
//     }
//   };

//   // Handle time picker change
//   const handleTimeChange = (time, type) => {
//     if (type === 'in') {
//       setInTime(time);
//     } else {
//       setOutTime(time);
//     }
//   };

//   // Handle date picker change
//   const handleDateChange = (selectedDate) => {
//     setDate(selectedDate);
//   };

//   // Enable or disable the Next button based on selections
//   useEffect(() => {
//     if (!routine || !date) {
//       setIsNextDisabled(true);
//       return;
//     }

//     if (routine === 'Pickup' && inTime) {
//       setIsNextDisabled(false);
//     } else if (routine === 'Drop' && outTime) {
//       setIsNextDisabled(false);
//     } else {
//       setIsNextDisabled(true);
//     }
//   }, [routine, inTime, outTime, date]);

//   // Send data to backend on 'Next' button click
//   const handleNextClick = async () => {
//     if (!empId) {
//       message.error('Employee ID not found. Please log in again.');
//       return;
//     }
  
//     const currentTime = moment(); // Get current time
//     const minPickupTime = currentTime.clone().add(6, 'hours'); // Minimum time for Pickup
//     const minDropTime = currentTime.clone().add(2, 'hours'); // Minimum time for Drop
  
//     // Check time validation for Pickup
//     if (routine === 'Pickup' && (date.isSame(currentTime, 'day') && (!inTime || inTime.isBefore(minPickupTime)))) {
//       message.error('Pickup time must be at least 6 hours from the current time.');
//       return;
//     }
  
//     // Check time validation for Drop
//     if (routine === 'Drop' && (date.isSame(currentTime, 'day') && (!outTime || outTime.isBefore(minDropTime)))) {
//       message.error('Drop time must be at least 2 hours from the current time.');
//       return;
//     }
  
//     const tripData = {
//       EmployeeId: empId,
//       date: date.format('YYYY-MM-DD'),
//       inTime: routine === 'Pickup' && inTime ? inTime.format('HH:mm:ss') : null,
//       outTime: routine === 'Drop' && outTime ? outTime.format('HH:mm:ss') : null,
//     };
  
//     try {
//       const response = await axios.post('http://localhost:5000/emp/trips', tripData);
//       console.log(response.data);
//       setIsModalVisible(true); // Show confirmation modal
//     } catch (error) {
//       console.error('Error creating/updating trip:', error);
//       message.error('Failed to place cab request. Please try again.');
//     }
//   };  

//   // Close the modal when "Done" is clicked
//   const handleDone = () => {
//     setIsModalVisible(false);
//     navigate('/dashboard'); // Navigate back to dashboard or another route
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
//       {/* Header with Back Button and Notification */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <LeftOutlined onClick={() => navigate('/dashboard')} style={{ fontSize: '20px', cursor: 'pointer' }} />
//         <h3>Create Trips</h3>
//         <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
//       </div>

//       {/* Routine */}
//       <div style={{ marginTop: '20px' }}>
//         <p>Routine</p>
//         <div style={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: '100%' }}>
//           {['Pickup', 'Drop'].map(option => (
//             <Button
//               key={option}
//               onClick={() => handleRoutineClick(option)}
//               style={{ 
//                 color: routine === option ? 'white' : '', 
//                 backgroundColor: routine === option ? 'rgb(24, 144, 255)' : '',
//                 width: '100px'
//               }}
//             >
//               {option}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* Time Picker */}
//       <div style={{ marginTop: '20px' }}>
//         {routine === 'Pickup' && (
//           <div>
//             <p>In Time</p>
//             <TimePicker
//               value={inTime}
//               format={'h:mm A'}
//               onChange={(time) => handleTimeChange(time, 'in')}
//               style={{ width: '100%' }}
//             />
//           </div>
//         )}
        
//         {routine === 'Drop' && (
//           <div>
//             <p>Out Time</p>
//             <TimePicker
//               value={outTime}
//               format={'h:mm A'}
//               onChange={(time) => handleTimeChange(time, 'out')}
//               style={{ width: '100%' }}
//             />
//           </div>
//         )}
//       </div>

//       {/* Date Picker */}
//       <div style={{ marginTop: '20px' }}>
//         <p>Date Of Schedule</p>
//         <DatePicker
//           style={{ width: '100%' }}
//           value={date}
//           onChange={handleDateChange}
//           disabledDate={(current) => current && current < moment().startOf('day')}
//         />
//       </div>

//       {/* Next Button */}
//       <div style={{ marginTop: '25px', textAlign: 'center' }}>
//         <Button 
//           type="primary" 
//           style={{ width: '100px' }} 
//           onClick={handleNextClick}
//           disabled={isNextDisabled}
//         >
//           Submit
//         </Button>
//       </div>

//       {/* Confirmation Modal */}
//       <Modal
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         centered
//       >
//         <div style={{ textAlign: 'center', padding: '20px' }}>
//           <CheckCircleOutlined style={{ fontSize: '64px', color: 'green', animation: 'bounce 1s infinite' }} />
//           <h2>Cab Request Placed Successfully!</h2>
//           <p><strong>Routine:</strong> {routine}</p>
//           <p><strong>Date:</strong> {date ? date.format('YYYY-MM-DD') : 'Not selected'}</p>
//           {routine === 'Pickup' && <p><strong>In Time:</strong> {inTime ? inTime.format('h:mm A') : 'Not selected'}</p>}
//           {routine === 'Drop' && <p><strong>Out Time:</strong> {outTime ? outTime.format('h:mm A') : 'Not selected'}</p>}
//           <Button type="primary" onClick={handleDone} style={{ marginTop: '20px', width: '100px' }}>
//             Done
//           </Button>
//         </div>
//       </Modal>

//       {/* CSS for animated tick mark */}
//       <style>
//         {`
//           @keyframes bounce {
//             0%, 100% {
//               transform: scale(1);
//             }
//             50% {
//               transform: scale(1.2);
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default CreateTrips;

import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Modal, message } from 'antd';
import { LeftOutlined, BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const CreateTrips = () => {
  const navigate = useNavigate();
  
  // State to hold selected shift and date
  const [shift, setShift] = useState(null);  // New state for shifts
  const [date, setDate] = useState(moment()); // Set default to today
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const empId = Cookies.get('EmployeeID'); // Get EmployeeID from cookies

  // Handle shift selection
  const handleShiftClick = (selectedShift) => {
    setShift(selectedShift);
  };

  // Handle date picker change
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  // Enable or disable the Next button based on shift and date
  useEffect(() => {
    setIsNextDisabled(!shift || !date); // Disable if either shift or date is not selected
  }, [shift, date]);

  const [inTime,setinTime] = useState('');
  const [outTime,setoutTime] = useState('');

  // Send data to backend on 'Submit' button click
  const handleNextClick = async () => {
    if (!empId) {
      message.error('Employee ID not found. Please log in again.');
      return;
    }
  
    // Set inTime and outTime based on shift selection
    let innTime = '';
    let outtTime = '';
    if (shift === '9am-3pm') {
      setinTime('09:00:00');
      innTime = '09:00:00';
      setoutTime('15:00:00');
      outtTime = '15:00:00';
    } else if (shift === '3pm-9pm') {
      setinTime('15:00:00');
      innTime = '15:00:00';
      setoutTime('21:00:00');
      outtTime = '21:00:00';
    }

    const currentTime = moment();
    const minShiftTime = currentTime.clone().add(4, 'hours'); // Minimum time for shift selection
    const innTimeMoment = date
    .hour(parseInt(innTime.split(':')[0]))
    .minute(parseInt(innTime.split(':')[1]))
    .second(0);

    // Check time validation for Pickup
    if (date.isSame(currentTime, 'day') && (innTimeMoment.isBefore(minShiftTime))) {
      message.warning('Cab should be requested 4 hours before the shift');
      return;
    }
  
    const tripData = {
      EmployeeId: empId,
      date: date.format('YYYY-MM-DD'),
      inTime: innTime,
      outTime: outtTime,
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

  // const handleNextClick = async () => {
  //   if (!empId) {
  //     message.error('Employee ID not found. Please log in again.');
  //     return;
  //   }

  //   // Set inTime and outTime based on shift selection
  //   let innTime=''
  //   let outtTime=''
  //   if (shift === '9am-3pm') {
  //     setinTime('09:00:00');
  //     innTime='09:00:00';
  //     setoutTime('15:00:00');
  //     outtTime='15:00:00';
  //   } else if (shift === '3pm-9pm') {
  //     setinTime('15:00:00');
  //     innTime='15:00:00';
  //     setoutTime('21:00:00');
  //     outtTime='21:00:00';
  //   }
    
    
  //   const tripData = {
  //     EmployeeId: empId,
  //     date: date.format('YYYY-MM-DD'),
  //     inTime: innTime,
  //     outTime: outtTime,
  //   };

  //   try {
  //     console.log(tripData)
  //     const response = await axios.post('http://localhost:5000/emp/trips', tripData);
  //     console.log(response.data);
  //     setIsModalVisible(true); // Show confirmation modal
  //   } catch (error) {
  //     console.error('Error creating/updating trip:', error);
  //     message.error('Failed to place cab request. Please try again.');
  //   }
  // };  

  // Close the modal when "Done" is clicked
  const handleDone = () => {
    setIsModalVisible(false);
    navigate('/dashboard'); // Navigate back to dashboard or another route
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* Header with Back Button and Notification */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:"40px" }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} style={{ fontSize: '20px', cursor: 'pointer' }} />
        <h2 style={{margin:"0"}}>Create Trips</h2>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </div>

      {/* Shift Selection */}
      <div style={{ marginTop: '20px' }}>
        <p>Select Shift</p>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', maxWidth: '100%' }}>
          {['9am-3pm', '3pm-9pm'].map(option => (
            <Button
              key={option}
              onClick={() => handleShiftClick(option)}
              style={{ 
                color: shift === option ? 'white' : '', 
                backgroundColor: shift === option ? 'rgb(24, 144, 255)' : '',
                width: '100px'
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div style={{ marginTop: '20px' }}>
        <p>Date Of Schedule</p>
        <DatePicker
          style={{ width: '100%' }}
          value={date}
          onChange={handleDateChange}
          disabledDate={(current) => current && current < moment().startOf('day')}
        />
      </div>

      {/* Next Button */}
      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <Button 
          type="primary" 
          style={{ width: '100px' }} 
          onClick={handleNextClick}
          disabled={isNextDisabled}
        >
          Submit
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
          <p><strong>Shift:</strong> {shift}</p>
          <p><strong>Date:</strong> {date ? date.format('YYYY-MM-DD') : 'Not selected'}</p>
          <p><strong>In Time:</strong> {inTime}</p>
          <p><strong>Out Time:</strong> {outTime}</p>
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
