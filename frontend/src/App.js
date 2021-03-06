import './App.css';
import { Layout, Space, Menu, Breadcrumb } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';

import DogScreen from './screen/DogScreen';
import DogAddScreen from './screen/DogAddScreen';
import DogEditScreen from './screen/DogEditScreen';
import FavouriteListScreen from './screen/FavouriteListScreen';
import SignInScreen from './screen/SignInScreen';
import SignUpScreen from './screen/SignUpScreen';
import NotFound from "./screen/NotFound";

const { Header, Content, } = Layout;

export default function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/signin';
  };

  return (
    <Router>
      <Header>
        <Menu theme="dark" mode="horizontal" warnKey={1}>
          <Space>
            <Menu.Item warnKey="menu">
              <Link to="" className='disabled-link'>VT6003CEM Web API</Link>
            </Menu.Item>
            <Link to="/">Dog</Link>
            {
              userInfo ? (
                <>
                  <Link to="/favList">Favourite List</Link>
                  <Link to="#signout" onClick={signoutHandler}>Sign Out</Link>
                </>
              ) : (
                <>
                  <Link to="/SignIn">Sign In</Link>
                  <Link to="/SignUp">Sign Up</Link>
                </>
              )
            }
          </Space>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dog</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
          <Route exact path="/" element={<DogScreen />} />
          <Route path="/" element={<DogScreen />} />
          <Route path="/dog_add" element={<DogAddScreen />} />
          <Route path="/dog/:_id" element={<DogEditScreen />} />
          <Route path="/favList" element={<FavouriteListScreen />} />
          <Route path="/SignIn" element={<SignInScreen />} />
          <Route path="/SignUp" element={<SignUpScreen />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Content>
    </Router >
  );
}