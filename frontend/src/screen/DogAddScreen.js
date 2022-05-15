import React, { useState, useContext, useEffect } from 'react';
import { Store } from '../Store';
import { Form, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const { Option } = Select;

function DogAddScreen() {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [adoption, setAdoption] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState("");
  const [form] = Form.useForm();

  const { state } = useContext(Store);
  const { userInfo } = state;

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

  async function handleSubmit() {
    console.log(userInfo.token)
    try {
      const data = await Axios.post('http://localhost:5005/api/v1/dog/', {
        name,
        breed,
        description,
        adoption,
        image,
        images,
      },
        { headers: { Authorization: `Bearer ${userInfo.token}` }, }
      );
      if (data.status === 200) {
        alert("Submit Success.");
        form.resetFields()
      } else {
        alert("Submit Fail. Please retry.");
      }
    } catch (err) {
      alert("Submit Fail. Please retry later.");
      console.log(err);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  function adoptionSelect(value, evt){
    setAdoption(value)
  }

  return (
    <div>
      <Form onFinish={handleSubmit} {...formItemLayout} form={form} name="dog register" scrollToFirstError >

        <Form.Item name="name" label="Nickname" value={name} onChange={(e) => setName(e.target.value)} tooltip="What do you want others to call you?"
          rules={[{ required: true, message: 'Please input the dog nickname!', whitespace: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="adoption" label="Adoption" rules={[{ required: true, message: 'Please select status of adoption.' }]}>
            <Select onChange={adoptionSelect}>
              <Option value="true">Adopted</Option>
              <Option value="false">Non-adopted</Option>
            </Select>
        </Form.Item>

        <Form.Item name="breed" label="Breed" onChange={(e) => setBreed(e.target.value)}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" onChange={(e) => setDescription(e.target.value)}>
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item name="image" label="Image" onChange={(e) => setImage(e.target.value)}>
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item name="images" label="Images" onChange={(e) => setImages(e.target.value)}>
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit"> Register </Button>
          &nbsp;&nbsp;
          <Button type="primary" danger htmlType="reset" onClick={onReset}> Reset </Button>
          &nbsp;&nbsp;
          <Button htmlType="reset"><Link to="/dog"> Back </Link></Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DogAddScreen;