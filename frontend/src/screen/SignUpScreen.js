import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Axios from 'axios';
import bcryptjs from 'bcryptjs';

function SignUpScreen() {
  const [form] = Form.useForm();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      const { data } = await Axios.post('http://localhost:5005/api/v1/dog/res/', {
        fname,
        lname,
        username,
        password,
      });
      if (data.status === 200) {
        alert("Submit Success");
        form.resetFields()
      } else {
        alert("Submit Fail. Please try again later");
      }
    } catch (error) {
      alert("Submit Fail. Please retry");
    }
  }

  return (
    <Form name="basic" labelCol={{ span: 24 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={handleSubmit} autoComplete="off">
      <Form.Item label="Frist Name" name="fname" 
        onChange={(e) => setFname(e.target.value)} 
        rules={[{ required: true, message: 'Please input your first name!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Last Name" name="lname" 
        onChange={(e) => setLname(e.target.value)} 
        rules={[{ required: true, message: 'Please input your last name!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Username" name="username" 
        onChange={(e) => setUsername(e.target.value)} 
        rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Password" name="password" 
        onChange={(e) => setPassword(bcryptjs.hashSync(e.target.value))} 
        rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback
        rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
          },
        }),
      ]}>
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit"> Submit </Button>
      </Form.Item>
    </Form>
  );
}
export default SignUpScreen;