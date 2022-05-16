import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';
import { attachTypeApi } from 'antd/lib/message';
// import Container from 'react-bootstrap/Container';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';

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

const { Option } = Select;

function DogEditScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { _id } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [adoption, setAdoption] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState("");

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
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await Axios.get(`http://localhost:5005/api/v1/dog/${_id}`);
        if (result.status === 200) {
          setName(result.data.name)
          setBreed(result.data.breed)
          setDescription(result.data.description)
          setAdoption(result.data.adoption)
          setImage(result.data.image)
          setImages(result.data.images)
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        } else {
          dispatch({ type: 'FETCH_SUCCESS', payload: null });
        }
      } catch (err) {
        dispatch({ type: 'FETCH_SUCCESS', payload: null });
      }
    };
    fetchData();
  }, []);

  const [{ loading, error, dog }, dispatch] = useReducer(reducer, {
    dog: [],
    loading: true,
    error: '',
  });

  async function handleSubmit() {
    try {
      const data = await Axios.post(`http://localhost:5005/api/v1/dog/${_id}`, {
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
      } else {
        alert("Submit Fail. Please retry.");
      }
    } catch (err) {
      alert("Submit Fail. Please retry later.");
      console.log(err);
    }
  }

  const adoptionSelect = (value, evt) => {
    setAdoption(value)
  }

  const adoptionValue = () => {
    return "" + adoption
  }

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await Axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      alert('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      alert(err);
      dispatch({ type: 'UPLOAD_FAIL', payload: "Error" });
    }
  };

  const delClick = async () => {
    try {
      const data = await Axios.post(`http://localhost:5005/api/v1/dog/delete/${_id}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` }, }
      );
      alert("Delete Success");
      navigate("/");
    } catch (err) {
      alert("Delete Fail. Please content Admin.");
      console.log(err);
    }
  }

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>error</div>
  ) : (
    <div>
      <Form onFinish={handleSubmit} {...formItemLayout} form={form} name="dog register" scrollToFirstError>

        <Form.Item name="name" label="Nickname" onChange={(e) => setName(e.target.value)}
          rules={[{ required: true, message: 'Please input the dog nickname!', whitespace: true }]}>
          {userInfo ? (<Input defaultValue={name} />) : (<Input disabled defaultValue={name} />)}
        </Form.Item>

        <Form.Item name="adoption" label="Adoption" rules={[{ required: true, message: 'Please select status of adoption.' }]}>
          {userInfo ? (
            <Select defaultValue={adoptionValue} onChange={adoptionSelect}>
              <Option value="true">Adopted</Option>
              <Option value="false">Non-adopted</Option>
            </Select>
          ) : (
            <Select defaultValue={adoptionValue} disabled>
              <Option value="true">Adopted</Option>
              <Option value="false">Non-adopted</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item name="breed" label="Breed" onChange={(e) => setBreed(e.target.value)}>
          {userInfo ? (<Input defaultValue={breed} />) : (<Input disabled defaultValue={breed} />)}
        </Form.Item>

        <Form.Item name="description" label="Description" onChange={(e) => setDescription(e.target.value)}>
          {userInfo ? (<Input.TextArea showCount maxLength={100} defaultValue={description} />) : (<Input.TextArea disabled showCount maxLength={100} defaultValue={description} />)}
        </Form.Item>

        <Form.Item name="image" label="Image" onChange={(e) => setImage(e.target.value)}>
          {userInfo ? (<Input.TextArea showCount maxLength={100} defaultValue={image} />) : (<Input.TextArea disabled showCount maxLength={100} defaultValue={image} />)}
        </Form.Item>

        <Form.Item name="images" label="Images" onChange={(e) => setImages(e.target.value)}>
          {userInfo ? (<Input.TextArea showCount maxLength={100} defaultValue={images} />) : (<Input.TextArea disabled showCount maxLength={100} defaultValue={images} />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          {
            userInfo ? userInfo.isAdmin ? (
              <>
                <Button type="primary" htmlType="submit"> Confirm & Submit </Button>
                <>&nbsp;&nbsp;</>
                <Button type="danger" onClick={delClick}> Delete </Button>
                <>&nbsp;&nbsp;</>
              </>
            ) : (<></>) : (<></>)
          }
          <Button htmlType="reset"><Link to="/"> Back </Link></Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default DogEditScreen;