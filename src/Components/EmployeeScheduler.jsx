import React, { useState } from 'react';
import './EmployeeScheduler.css';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { LeftOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const EmployeeScheduler = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showOptions, setShowOptions] = useState(false); // State to show/hide "Pick up" and "Drop" options

  const onValuesChange = (changedValues) => {
    if (changedValues.shift) {
      setShowOptions(true); // Show options when shift is selected
    }
  };

  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <LeftOutlined onClick={() => navigate('/dashboard')} />
        <h3>Create Trips</h3>
        <BellOutlined />
      </div>
      <div className="EmployeeScheduler-body">
        <Form
          form={form}
          name="employee_form"
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange} // Track changes in form
        >
          {/* Employee ID Input */}
          <Form.Item
            label="Your Location"
            name="yourlocation"
            rules={[{ required: true, message: 'Check Your Location Details' }]}
          >
            <Input placeholder="Check Your Location" />
          </Form.Item>

          {/* Shift Selector */}
          <Form.Item
            label="Select Shift"
            name="shift"
            rules={[{ required: true, message: 'Please select a shift' }]}
          >
            <Select placeholder="Select a Shift">
              {/* <Option value="General">General ()</Option> */}
              <Option value="Shift-A">Shift-A (9:00 AM - 5:00 PM)</Option>
              <Option value="Shift-B">Shift-B (5:00 PM - 1:00 AM)</Option>
              <Option value="Shift-C">Shift-C (1:00 AM - 9:00 AM)</Option>
            </Select>
          </Form.Item>

          {/* Conditionally render Pick up and Drop options */}
          {showOptions && (
            <Form.Item
              label="Pick up or Drop"
              name="pickupOrDrop"
              rules={[{ required: true, message: 'Please select an option' }]}
            >
              <Select placeholder="Select Pick up or Drop">
                <Option value="Pick up">Pick up</Option>
                <Option value="Drop">Drop</Option>
              </Select>
            </Form.Item>
          )}

          {/* Date Picker */}
          <Form.Item
            label="Select Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }}
            getPopupContainer={(trigger) => trigger.parentElement} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Book Cab
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EmployeeScheduler;
