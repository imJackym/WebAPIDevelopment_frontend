import { Form, Input, Card, Button, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

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
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, dogs: action.payload, allBreeds: action.sss, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_SEARCH':
      return { ...state, dogs: action.payload, loading: false };
    case 'FETCH_SEARCH_BREED':
      return { ...state, dogs: action.payload, loading: false };
    default:
      return state;
  }
};

export default function DogScreen() {

  const { state } = useContext(Store);
  const navigate = useNavigate();
  const { userInfo } = state;

  const [{ loading, error, dogs }, dispatch] = useReducer(reducer, {
    dogs: [],
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

  const onSearch = value => {
    const fetchData = async () => {
      try {
        if (value !== "") {
          const result = await axios.get(`http://localhost:5005/api/v1/dog/search/${value}`);
          dispatch({ type: 'FETCH_SEARCH', payload: result.data });
        } else {
          const result = await axios.get('http://localhost:5005/api/v1/dog');
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        console.log(error)
        dispatch({ type: 'FETCH_FAIL', payload: "ERROR" })
      }
    };
    fetchData();
  }

  return loading ? (
    <div>Loading</div>
  ) : error ? (
    <div>Error</div>
  ) : (
    <div>
      <div>
        <Search placeholder="Search Name" onSearch={onSearch} style={{ width: 200 }} />
        &nbsp;
        {
          userInfo ? userInfo.isAdmin ? (
            <Button type="primary">
              <Link to="/dog_add">Add new dog</Link>
            </Button>
          ) : (<></>) : (<></>)
        }
      </div>
      <br />
      {
        dogs.dogs?.map((dog) => (
          <div className="dog" key={`${dog.id}`}>
            <Link to={`/dog/${dog._id}`}>
              <Card.Grid style={gridStyle}>
                <Card style={cardStyle} cover={<img alt="Dog Img" src={`http://localhost:5005/public/images/${dog.image}`} />}>
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