import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Axios from 'axios';
import bcryptjs from 'bcryptjs';

function SignInScreen() {
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    console.log(password)
    try {
      const { data } = await Axios.post('http://localhost:5005/api/v1/dog/res/', {
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
      <Form.Item label="Username" name="username" onChange={(e) => setUsername(e.target.value)} rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Password" name="password" onChange={(e) => setPassword(bcryptjs.hashSync(e.target.value))} rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit"> Submit </Button>
      </Form.Item>
    </Form>
  );
}
export default SignInScreen;