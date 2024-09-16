import React from 'react';
import { Card, Tabs, Button, List } from 'antd';
import { LeftOutlined,BellOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const tripData = [
  {
    time: "10:00 AM",
    type: "Pickup / Checkin",
    locations: [
      {
        address: "7675 Hillcrest St. Fairport, NY 14450",
        time: "02 Jan 23, 03:00 PM",
        status: "Searching for Driver/Taxi",
      },
      {
        address: "70 La Sierra St. Massapequa, NY 11758",
        time: "02 Jan 23, 04:00 PM",
        status: "Searching for Driver/Taxi",
      }
    ]
  },
  {
    time: "7:00 PM",
    type: "Drop / Checkout",
    locations: [],
    status: "Searching for Driver/Taxi"
  }
];

const UpcomingTrips = () => {
    const navigate = useNavigate();
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <LeftOutlined onClick={()=>navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <h3>Upcoming Trips</h3>
        <BellOutlined />
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Today" key="1" />
        <TabPane tab="Tomorrow" key="2" />
        <TabPane tab="This Week" key="3" />
        <TabPane tab="This Month" key="4" />
      </Tabs>

      {/* Date */}
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        Mon, 02 Jan 2023
      </div>

      {/* Trips */}
      {tripData.map((trip, index) => (
        <Card key={index} style={{ marginTop: '20px', borderRadius: '10px', borderColor: '#f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>{trip.type}</h4>
          </div>

          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
            {trip.time}
          </div>

          {trip.locations.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={trip.locations}
              renderItem={location => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined style={{ color: 'blue' }} />}
                    title={<span>{location.address}</span>}
                    description={<span>{location.time}</span>}
                  />
                    <SearchOutlined style={{ color: 'green', marginRight: '8px' }} />
                  {/* <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                    <span>{location.status}</span>
                  </div> */}
                </List.Item>
              )}
            />
          )}

          {index === 0 && (
            <Button type="primary" danger style={{borderRadius:"15px", marginTop: '10px', width: '100%' }}>
              Cancel Trip
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default UpcomingTrips;