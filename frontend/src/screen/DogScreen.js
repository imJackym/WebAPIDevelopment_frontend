import { Form, Input, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';

const { Meta } = Card;

const gridStyle = {
  width: '25%',
  // textAlign: 'center',
};

const cardStyle = {
  margin: 'auto',
  width: 'fit-content',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      // console.log("FETCH_REQUEST")
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      // console.log("FETCH_SUCCESS")
      return { ...state, dogs: action.payload, loading: false };
    case 'FETCH_FAIL':
      // console.log("FETCH_FAIL")
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DogScreen() {

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, dogs }, dispatch] = useReducer(reducer, {
    dogs: [],
    ad: null,
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('http://localhost:5005/api/v1/dog');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        console.log(error)
        dispatch({ type: 'FETCH_FAIL', payload: "ERROR" })
      }
    };
    fetchData();
  }, []);


  return loading ? (
    <div>Loading</div>
  ) : error ? (
    <div>Error</div>
  ) : (
    <div>
      <div>
        <Form.Item name="id" label="Id" tooltip="What do you want others to call you?" style={{ display: "none" }}
          rules={[{ message: 'Please input the dog nickname!' }]}>
          <Input style={{ display: "none" }} />
        </Form.Item>
        &nbsp;
        <Button type="primary">
          <Link to="/dog_add">Search</Link>
        </Button>
        &nbsp;
        {
          userInfo.isAdmin ? (
            <Button type="primary">
              <Link to="/dog_add">Add new dog</Link>
            </Button>
          ) : (
            <></>
          )
        }

        &nbsp;

      </div>
      <br />
      {
        dogs?.map((dog) => (
          <div className="dog" key={`${dog.id}`}>
            <Link to={`/dog/${dog.id}`}>
              <Card.Grid style={gridStyle}>
                <Card style={cardStyle} cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}>
                  <Meta title={`${dog.name}`} description={`${dog.breed}`} />
                </Card>
              </Card.Grid>
            </Link>
          </div>
        ))
      }
    </div >
  );
}