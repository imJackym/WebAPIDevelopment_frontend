import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, dog: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
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
  const [file, setFile] = useState("");
  const [fav_button, setFav_button] = useState("Add Favourite List");

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
          if (result.data.image) {
            console.log("ture")
            console.log(result.data.image)
            setImage(result.data.image)
            setFile(result.data.image)
          } else {
            console.log("false")
            setFile("https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png")
          }
          if (userInfo != null) {
            let name = result.data.name
            const fav = await Axios.post(`http://localhost:5005/api/v1/user/favlist/`,
              { name },
              { headers: { Authorization: `Bearer ${userInfo.token}` }, }
            );
            for (let i = 0; i < fav.data.favlist.length; i++) {
              if (_id.indexOf(fav.data.favlist[i]) >= 0) {
                setFav_button("Remove Favourite List")
              }
            }
          }
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

  const delClick = async () => {
    try {
      const data = await Axios.post(`http://localhost:5005/api/v1/dog/delete/${_id}`, {},
        { headers: { Authorization: `Bearer ${userInfo.token}` }, }
      );
      alert("Delete Success");
      navigate("/");
    } catch (err) {
      alert("Delete Fail. Please content Admin.");
      console.log(err);
    }
  }

  const handleUploadFile = async (e) => {
    try {
      const file = e.target.files[0];
      const bodyFormData = new FormData();
      bodyFormData.append('pic', file);
      const result = await Axios.post(`http://localhost:5005/api/v1/dog/upload/`,
        bodyFormData, { headers: { Authorization: `Bearer ${userInfo.token}` }, }
      );
      console.log("result.data.fullPath : " + result.data.fullPath)
      setImage(result.data.fullPath)
    } catch (err) {
      console.log("handleUploadFile err")
    }
  }

  const addFav = async (value) => {
    const username = `${userInfo.name}`
    console.log(`${userInfo.token}`)
    try {
      if (fav_button === "Add Favourite List") {
        const data = await Axios.post(`http://localhost:5005/api/v1/user/fav/${_id}`,
          { name: username },
          { headers: { Authorization: `Bearer ${userInfo.token}` }, }
        );
        console.log(data)
        alert("Add to your favourite list")
        setFav_button("Remove Favourite List")
      } else if (fav_button === "Remove Favourite List") {
        const data = await Axios.post(`http://localhost:5005/api/v1/user/refav/${_id}`,
          { name: username },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        alert("Remove to your favourite list")
        setFav_button("Add Favourite List")
      }
    } catch (err) {
      alert("Please try again later or content Admin.");
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

        <Form.Item name="image" label="Image">
          {
            userInfo ? userInfo.isAdmin ? (
              <input type="file" name='pic' id='pic' onChange={handleUploadFile} />) :
              (<></>) :
              (<></>)
          }
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
          {
            userInfo ? (
              <>
                <Button type="primary" style={{ background: "#28a745" }} onClick={addFav}> {fav_button} </Button>
                <>&nbsp;&nbsp;</>
              </>
            ) : (<></>)
          }
          <Button htmlType="reset"><Link to="/"> Back </Link></Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default DogEditScreen;