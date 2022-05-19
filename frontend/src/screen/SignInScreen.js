import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { Form, Input, Button } from 'antd';
import Axios from 'axios';
import bcryptjs from 'bcryptjs';

function SignInScreen() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  async function handleSubmit() {
    try {
      console.log(username)
      console.log(password)
      const { data } = await Axios.post('http://localhost:5005/api/v1/user/login', {
        username,
        password,
      });
      if (data.status === 200) {
        alert("Submit Success");
        ctxDispatch({ type: 'USER_SIGNIN', payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate(redirect || '/');
      } else {
        alert(data.status);
      }
    } catch (error) {
      alert("Submit Fail. Please retry");
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Form name="basic" labelCol={{ span: 24 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={handleSubmit} autoComplete="off">
      <Form.Item label="Username" name="username" onChange={(e) => setUsername(e.target.value)} rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Password" name="password" onChange={(e) => setPassword(e.target.value)} rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit"> Submit </Button>
      </Form.Item>
    </Form>
  );
}
export default SignInScreen;