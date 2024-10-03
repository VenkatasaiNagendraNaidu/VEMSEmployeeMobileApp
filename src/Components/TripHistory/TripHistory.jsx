// import React, { useState } from 'react';
// import { Card, Button, Collapse, Row, Col, Tabs, Divider, Empty } from 'antd';
// import { BellOutlined, DownOutlined, LeftOutlined, EnvironmentOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// const { Panel } = Collapse;
// const { TabPane } = Tabs;

// const TripHistory = () => {
//   const navigate = useNavigate();
//   const [activeKey, setActiveKey] = useState([]);

//   const handleToggle = (key) => {
//     setActiveKey(activeKey.includes(key) ? [] : [key]);
//   };

//   // Modified TripDetail component based on your requirements
//   const TripDetail = ({ trip }) => (
//     <div>
//       {/* Driver and Vehicle Info */}
//       <Row>
//         <Col span={12}>
//           <p><strong>Driver Name:</strong> <br/> {trip.driverName}</p>
//         </Col>
//         <Col span={12}>
//           <p><strong>Vehicle Number:</strong> <br/> {trip.vehicleNumber}</p>
//         </Col>
//       </Row>
//       <Row>
//         <Col span={12}>
//           <p><strong>Passengers:</strong> {trip.passengers}</p>
//         </Col>
//         <Col span={12}>
//           <p><strong>Type:</strong> {trip.type}</p>
//         </Col>
//       </Row>

//       <Divider />

//       {/* Conditional Rendering for Addresses */}
//       {trip.type === 'Pickup' ? (
//         <>
//           <Row>
//             <Col>
//               <p><EnvironmentOutlined style={{color:"green"}}/> {trip.employeeAddress}</p>
//             </Col>
//           </Row>
//           <Row>
//             <Col>
//               <p><EnvironmentOutlined style={{color:"red"}}/> {trip.officeAddress}</p>
//             </Col>
//           </Row>
//         </>
//       ) : (
//         <>
//           <Row>
//             <Col>
//               <p><EnvironmentOutlined style={{color:"green"}}/> {trip.officeAddress}</p>
//             </Col>
//           </Row>
//           <Row>
//             <Col>
//               <p><EnvironmentOutlined style={{color:"red"}}/> {trip.employeeAddress}</p>
//             </Col>
//           </Row>
//         </>
//       )}
//     </div>
//   );

//   const renderTripCards = (key) => {
//     // Sample trip data, replace with real data
//     const tripData = [
//       {
//         rideId: 'ABCDE12345',
//         date: '02 Jan 23',
//         loginTime: '03:00 PM',
//         logoutTime: '04:00 PM',
//         driverName: 'John Doe',
//         vehicleNumber: 'XYZ-1234',
//         passengers: 4,
//         type: 'Pickup',
//         employeeAddress: '7675 Hillcrest St. Fairport, NY 14450',
//         officeAddress: '70 La Sierra St. Massapequa, NY 11758',
//       },
//       {
//         rideId: 'ABCDE67890',
//         date: '02 Jan 23',
//         loginTime: '03:00 PM',
//         logoutTime: '04:00 PM',
//         driverName: 'Jane Smith',
//         vehicleNumber: 'ABC-9876',
//         passengers: 5,
//         type: 'Drop',
//         employeeAddress: '123 Maple Ave, Rochester, NY 14620',
//         officeAddress: '456 Oak St, Buffalo, NY 14203',
//       },
//     ];

//     return tripData.map((trip, index) => (
//       <Card key={trip.rideId} style={{ marginBottom: '10px' }}>
//         <Collapse activeKey={activeKey} onChange={() => handleToggle(trip.rideId)}>
//           <Panel
//             header={
//               <div>
//                 <Row justify="space-between">
//                   <Col>
//                     <strong>TRIP ID: {trip.rideId}</strong>
//                   </Col>
//                   <Col>
//                     <DownOutlined />
//                   </Col>
//                 </Row>
//                 <p>{trip.date}, {trip.loginTime} - {trip.logoutTime}</p>
//               </div>
//             }
//             key={trip.rideId}
//           >
//             <TripDetail trip={trip} />
//           </Panel>
//         </Collapse>
//       </Card>
//     ));
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
//         <LeftOutlined onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
//         <h2 style={{margin: 0}}>Trip History</h2>
//         <BellOutlined />
//       </div>
//       <Tabs defaultActiveKey="2" centered>
//         <TabPane tab="Previous" key="1">
//           {renderTripCards("1")}
//         </TabPane>
//         <TabPane tab="Today" key="2">
//           {renderTripCards("2")}
//         </TabPane>
//       </Tabs>
//     </div>
//   );
// };

// export default TripHistory;


import React, { useState, useEffect } from 'react';
import { Card, Collapse, Row, Col, Tabs, Divider, Empty, Spin } from 'antd';
import { BellOutlined, DownOutlined, LeftOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';  // For date handling
import Cookies from 'js-cookie';


const { Panel } = Collapse;
const { TabPane } = Tabs;

const TripHistory = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [employeeCounts, setEmployeeCounts] = useState({}); // State to store employee counts by RideId
  const [loading, setLoading] = useState(true);
  const empId = Cookies.get('EmployeeID'); // Replace with dynamic EmployeeId (you can fetch it from cookies or user state)

  useEffect(() => {
    // Fetch trip data from the backend
    const fetchTripData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/emp/ridedetails/${empId}`);
        setTripData(response.data);
        setLoading(false);
        // Fetch employee counts for each RideId
        response.data.forEach(trip => fetchEmployeeCount(trip.RideId));
      } catch (error) {
        console.error('Error fetching trip data:', error);
        setLoading(false);
      }
    };
    fetchTripData();
  }, [empId]);

  // Fetch employee count for a given RideId
  const fetchEmployeeCount = async (rideId) => {
    try {
      const response = await axios.get(`http://localhost:5000/emp/ridecount/${rideId}`);
      setEmployeeCounts(prevCounts => ({
        ...prevCounts,
        [rideId]: response.data.employeeCount,
      }));
    } catch (error) {
      console.error(`Error fetching employee count for RideId ${rideId}:`, error);
    }
  };

  const handleToggle = (key) => {
    setActiveKey(activeKey.includes(key) ? [] : [key]);
  };

  const TripDetail = ({ trip }) => (
    <div>
      {/* Driver and Vehicle Info */}
      <Row>
        <Col span={12}>
          <p><strong>Driver Name:</strong> <br /> {trip.DriverName}</p>
        </Col>
        <Col span={12}>
          <p><strong>Vehicle Number:</strong> <br /> {trip.VehicleNumber}</p>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <p><strong>Passengers:</strong> {employeeCounts[trip.RideId] || 'Loading...'}</p> {/* Display employee count */}
        </Col>
        <Col span={12}>
          <p><strong>Type:</strong> {trip.TripType}</p>
        </Col>
      </Row>

      <Divider />

      {/* Conditional Rendering for Addresses */}
      {trip.TripType === 'PICKUP' ? (
        <>
          <Row>
            <Col>
              <p><EnvironmentOutlined style={{ color: "green" }} /> {`${trip.EmployeeAddress}, ${trip.EmployeeCity}`}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><EnvironmentOutlined style={{ color: "red" }} /> The Hive, OMR</p>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col>
              <p><EnvironmentOutlined style={{ color: "green" }} /> The Hive, OMR</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p><EnvironmentOutlined style={{ color: "red" }} /> {`${trip.EmployeeAddress}, ${trip.EmployeeCity}`}</p>
            </Col>
          </Row>
        </>
      )}
    </div>
  );

  const filterTrips = (trips, isToday) => {
    const today = moment().format('YYYY-MM-DD');
       
    return trips.filter(trip => {
      const tripDate = moment(trip.TripDate).format('YYYY-MM-DD');
      return isToday ? tripDate === today : tripDate < today;
    });
  };

  const renderTripCards = (isToday) => {
    const filteredTrips = filterTrips(tripData, isToday);

    if (filteredTrips.length === 0) {
      return <Empty description={isToday ? "No trips for today" : "No previous trips"} />;
    }

    return filteredTrips.map((trip) => (
      <Card key={trip.RideId} style={{ marginBottom: '10px' }}>
        <Collapse activeKey={activeKey} onChange={() => handleToggle(trip.RideId)}>
          <Panel
            header={
              <div>
                <Row justify="space-between">
                  <Col>
                    <strong>TRIP ID: {trip.RideId}</strong>
                  </Col>
                  <Col>
                    <DownOutlined />
                  </Col>
                </Row>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                <p>SHIFT: {trip.LoginTime} - {trip.LogoutTime}</p>
                <p>{moment(trip.TripDate).format('DD MMM YY')}</p>
                </div>
              </div>
            }
            key={trip.RideId}
          >
            <TripDetail trip={trip} />
          </Panel>
        </Collapse>
      </Card>
    ));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <h2 style={{ margin: 0 }}>Trip History</h2>
        <BellOutlined />
      </div>

      {loading ? (
        <div style={{textAlign:"center"}}><br/><Spin /></div>

      ) : (
        <Tabs defaultActiveKey="2" centered>
          <TabPane tab="Previous" key="1">
            {renderTripCards(false)}
          </TabPane>
          <TabPane tab="Today" key="2">
            {renderTripCards(true)}
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default TripHistory;