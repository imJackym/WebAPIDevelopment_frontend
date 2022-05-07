import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Axios from 'axios';

function DogScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 4,
      },
    },
  };

  let handleSubmit = async (e) => {
    try {
      const { data } = await Axios.post('http://localhost:5005/api/v1/dog/res/', {
        name,
        category,
        brand,
        description,
        image,
      });
      if (data.status === 200) {
        alert("Submit Success");
        form.resetFields()
      } else {
        alert("Submit Fail. Please retry");
      }
    } catch (err) {
      alert("Submit Fail. Please retry");
      console.log(err);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Form onFinish={handleSubmit} {...formItemLayout} form={form} name="dog register" scrollToFirstError >

        <Form.Item name="name" label="Nickname" value={name} onChange={(e) => setName(e.target.value)} tooltip="What do you want others to call you?" rules={[{ required: true, message: 'Please input the dog nickname!', whitespace: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="category" label="Category" onChange={(e) => setCategory(e.target.value)} rules={[{ required: true, message: 'Please input the dog category!', whitespace: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="brand" label="Brand" onChange={(e) => setBrand(e.target.value)} rules={[{ required: true, message: 'Please input the dog brand!', whitespace: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" onChange={(e) => setDescription(e.target.value)} rules={[{ required: true, message: 'Please input the dog description' }]} >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item name="image" label="Image" onChange={(e) => setImage(e.target.value)} rules={[{ required: true, message: 'Please input the dog image' }]} >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit"> Register </Button>
          &nbsp;&nbsp;
          <Button type="primary" danger htmlType="reset" onClick={onReset}> Reset </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DogScreen;