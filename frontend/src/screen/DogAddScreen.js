import React, { useState, useContext, useEffect,  } from 'react';
import { Store } from '../Store';
import { Form, Input, Button, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const { Option } = Select;

function DogAddScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [adoption, setAdoption] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
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
    try {
      const data = await Axios.post('http://localhost:5005/api/v1/dog/',
        {
          name,
          breed,
          description,
          adoption,
          image,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(image)
      if (data.status === 200) {
        alert("Submit Success.");
        form.resetFields()
        navigate("/");
      } else {
        alert("Submit Fail. Please retry.");
      }
    } catch (err) {
      alert("Submit Fail. Please retry later.");
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  function adoptionSelect(value, evt) {
    setAdoption(value)
  }

  const handleUploadFile = async (e) => {
    try {
      const file = e.target.files[0];
      const bodyFormData = new FormData();
      bodyFormData.append('pic', file);
      const result = await Axios.post(`http://localhost:5005/api/v1/dog/upload/`,
        bodyFormData, { headers: { Authorization: `Bearer ${userInfo.token}` }, }
      );
      setImage(result.data)
      setFile(URL.createObjectURL(e.target.files[0]))
    } catch (err) {
      console.log("handleUploadFile : " + err)
    }
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
            <Option value="false">Non-Adopted</Option>
          </Select>
        </Form.Item>

        <Form.Item name="breed" label="Breed" onChange={(e) => setBreed(e.target.value)}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" onChange={(e) => setDescription(e.target.value)}>
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item name="image" label="Image">
          <input type="file" name='pic' id='pic' onChange={handleUploadFile} />
        </Form.Item>

        <Form.Item name="preview" label="Preview">
          <img src={file} />
        </Form.Item>
        
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit"> Register </Button>
          &nbsp;&nbsp;
          <Button type="primary" danger htmlType="reset" onClick={onReset}> Reset </Button>
          &nbsp;&nbsp;
          <Button htmlType="reset"><Link to="/"> Back </Link></Button>
        </Form.Item>
      </Form>
      <br/>	&nbsp;
      <br/>	&nbsp;
    </div>
  );
};

export default DogAddScreen;