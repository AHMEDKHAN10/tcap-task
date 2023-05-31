import React from 'react'
import { Button, Form, Input, Space } from 'antd'

function RegistrationForm({onFinish}) {
  return (
    <Form name="form_item_path" layout="vertical" onFinish={onFinish} style={{ width: '85%', color: '#19125d', marginTop: 20 }}>
      <Space size={20} style={{ display: 'flex',  }} >
        <Form.Item 
          className='fieldTitle'
          name="firstName" 
          label="First Name" 
          tooltip="What do you want others to call you?"
          rules={[
                  {
                    required: true,
                    message: 'Please input your First Name!',
                  },
                ]}
        >
          <Input placeholder='John'/>
        </Form.Item>
        <Form.Item
          className='fieldTitle'
          name="lastName"
          label="Last Name"
          rules={[
                  {
                    required: true,
                    message: 'Please input your Last Name!',
                  },
                ]}
        >
          <Input placeholder='Kua'/>
        </Form.Item>
      </Space>

      <Form.Item
        className='fieldTitle'
        name="company"
        label="Company Name"
      >
        <Input placeholder='Your company name'/>
      </Form.Item>
      <Form.Item className='fieldTitle' name="telephone" label="Telephone Number">
        <Input placeholder='999-1334-138'/>
      </Form.Item>

      <Form.Item
        className='fieldTitle'
        name="email"
        label="Email"
        rules={[
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ]}
      >
        <Input placeholder='youremail@gmail.com'/>
      </Form.Item>
      <Form.Item
        className='fieldTitle'
        name="password"
        label="Password"
        hasFeedback
        
        rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
      >
        <Input.Password placeholder='your password'/>
      </Form.Item>
      <Form.Item 
        className='fieldTitle'
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
      >
        <Input.Password placeholder='confirm password'/>
      </Form.Item>
        
      <Button type="primary" htmlType="submit" className='regButton'>
        Register
      </Button>
    </Form>
  )
}

export default RegistrationForm