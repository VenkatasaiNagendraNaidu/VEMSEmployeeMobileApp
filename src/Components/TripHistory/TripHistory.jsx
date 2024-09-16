import React, { useState } from 'react';
import { Card, Button, Collapse, Row, Col, Tabs, Divider, Empty, Flex } from 'antd';
import { BellOutlined, DownOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;
const { TabPane } = Tabs;

const TripHistory = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState([]);

  const handleToggle = (key) => {
    setActiveKey(activeKey.includes(key) ? [] : [key]);
  };

  const TripDetail = () => (
    <div>
      <Row justify="space-between">
        <Col>
          <p><strong>Distance</strong></p>
          <p>12 Km</p>
        </Col>
        <Col>
          <p><strong>Employees</strong></p>
          <p>4</p>
        </Col>
        <Col>
          <p><strong>Type</strong></p>
          <p>Pickup</p>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col>
          <p>📍 7675 Hillcrest St. Fairport, NY 14450</p>
          <p>02 Jan 23, 03:00 PM</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>📍 70 La Sierra St. Massapequa, NY 11758</p>
          <p>02 Jan 23, 04:00 PM</p>
        </Col>
      </Row>
      <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Button type="primary" style={{ marginTop: '10px'}}>Check Detailed View</Button>
      </div>
    </div>
  );

  const renderTripCards = (key) => {
    if (key === "1") { 
      return (
        <>
          <Card style={{ marginBottom: '10px' }}>
            <Collapse activeKey={activeKey} onChange={() => handleToggle('1')}>
              <Panel
                header={
                  <div>
                    <Row justify="space-between">
                      <Col>
                        <strong>TRIP ID: ABCDE12345</strong>
                      </Col>
                      <Col>
                        <DownOutlined />
                      </Col>
                    </Row>
                    <p>02 Jan 23, 03:00 PM - 02 Jan 23, 04:00 PM</p>
                  </div>
                }
                key="1"
              >
                <TripDetail />
              </Panel>
            </Collapse>
          </Card>
          <Card>
            <Collapse activeKey={activeKey} onChange={() => handleToggle('2')}>
              <Panel
                header={
                  <div>
                    <Row justify="space-between">
                      <Col>
                        <strong>TRIP ID: ABCDE67890</strong>
                      </Col>
                      <Col>
                        <DownOutlined />
                      </Col>
                    </Row>
                    <p>02 Jan 23, 03:00 PM - 02 Jan 23, 04:00 PM</p>
                  </div>
                }
                key="2"
              >
                <TripDetail />
              </Panel>
            </Collapse>
          </Card>
        </>
      );
    } 
    if (key === "2") { 
      return (
        <>
          <Card style={{ marginBottom: '10px' }}>
            <Collapse activeKey={activeKey} onChange={() => handleToggle('1')}>
              <Panel
                header={
                  <div>
                    <Row justify="space-between">
                      <Col>
                        <strong>TRIP ID: ABCDE11111</strong>
                      </Col>
                      <Col>
                        <DownOutlined />
                      </Col>
                    </Row>
                    <p>02 Jan 23, 03:00 PM - 02 Jan 23, 04:00 PM</p>
                  </div>
                }
                key="1"
              >
                <TripDetail />
              </Panel>
            </Collapse>
          </Card>
          <Card>
            <Collapse activeKey={activeKey} onChange={() => handleToggle('2')}>
              <Panel
                header={
                  <div>
                    <Row justify="space-between">
                      <Col>
                        <strong>TRIP ID: ABCDE22222</strong>
                      </Col>
                      <Col>
                        <DownOutlined />
                      </Col>
                    </Row>
                    <p>02 Jan 23, 03:00 PM - 02 Jan 23, 04:00 PM</p>
                  </div>
                }
                key="2"
              >
                <TripDetail />
              </Panel>
            </Collapse>
          </Card>
        </>
      );
    }
    else { // Example for other tabs with no trips
      return <Empty description="No Trips Available" />;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} />
        <h3>Trip History</h3>
        <BellOutlined />
      </div>
      <Tabs defaultActiveKey="2" centered>
        <TabPane tab="Previous Trips" key="1">
          {renderTripCards("1")}
        </TabPane>
        <TabPane tab="Today" key="2">
          {renderTripCards("2")}
        </TabPane>
        <TabPane tab="Upcoming Trips" key="3">
          {renderTripCards("3")}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TripHistory;