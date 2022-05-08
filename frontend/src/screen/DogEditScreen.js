import React, { useState } from 'react';
import { useEffect, useReducer } from 'react';
import { Form, Input, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, dog: action.payload, loading: false };
    // case 'FETCH_FAIL':
    //   return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function DogEditScreen() {
  const [form] = Form.useForm();
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

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

  useEffect(() => {
    console.log("useEffect")
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await Axios.get(`http://localhost:5005/api/v1/dog/${id}`);
        if (result.data.status === 200) {
          console.log(200)
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data[0] });
        } else {
          dispatch({ type: 'FETCH_SUCCESS', payload: null });
        }
        console.log("-----------------------------")
      } catch (err) {
        dispatch({ type: 'FETCH_SUCCESS', payload: null });
      }
    };
    fetchData();
  }, [id]);

  const [{ loading, error, dog }, dispatch] = useReducer(reducer, {
    dog: [],
    loading: true,
    error: '',
  });

  let handleSubmit = async (e) => {
    try {
      const { data } = await Axios.post('http://localhost:5005/api/v1/dog/res/', {
        id,
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

  function cs(){
    setName(`${dog.id}`)
    setName(`${dog.name}`)
  }

  return loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>error</div>
    ) : (
      <div>
        <Form onFinish={handleSubmit} {...formItemLayout} form={form} name="dog register" scrollToFirstError>

          <Form.Item name="id" label="Id" tooltip="What do you want others to call you?" style={{ display: "none" }}
            rules={[{ message: 'Please input the dog nickname!'}]}>
            <Input style={{ display: "none" }} defaultValue={dog.id}/>
          </Form.Item>

          <Form.Item name="name" label="Nickname" onChange={(e) => setName(e.target.value)} tooltip="What do you want others to call you?"
            rules={[{ message: 'Please input the dog nickname!'}]}>
            <Input defaultValue={dog.name} />
          </Form.Item>

          <Form.Item name="category" label="Category" onChange={(e) => setCategory(e.target.value)}
            rules={[{ message: 'Please input the dog category!', whitespace: true }]}>
            <Input defaultValue={dog.category} />
          </Form.Item>

          <Form.Item name="brand" label="Brand" onChange={(e) => setBrand(e.target.value)}
            rules={[{ message: 'Please input the dog brand!', whitespace: true }]}>
            <Input defaultValue={dog.brand} />
          </Form.Item>

          <Form.Item name="description" label="Description" onChange={(e) => setDescription(e.target.value)}
            rules={[{ message: 'Please input the dog description' }]} >
            <Input.TextArea showCount maxLength={100} defaultValue={dog.description} />
          </Form.Item>

          <Form.Item name="image" label="Image" onChange={(e) => setImage(e.target.value)}
            rules={[{ message: 'Please input the dog image' }]} >
            <Input.TextArea showCount maxLength={100} defaultValue={dog.image} />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={(e) => cs()}> Confirm & Submit </Button>
            &nbsp;&nbsp;
            <Button htmlType="reset"><Link to="/dog"> Back </Link></Button>
          </Form.Item>
        </Form>
      </div>
    );
}
export default DogEditScreen;