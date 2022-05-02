import './App.css';
import { Layout, Space, Menu, Breadcrumb } from "antd";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import DogScreen from './screen/DogScreen';
import DogAddScreen from './screen/DogAddScreen';
import DogEditScreen from './screen/DogEditScreen';
import UserScreen from './screen/UserScreen';
import UserEditScreen from './screen/UserEditScreen';
import SignInScreen from './screen/SignInScreen';
import SignUpScreen from './screen/SignUpScreen';
import NotFound from "./screen/NotFound";

const { Header, Content, Footer } = Layout;

export default function App() {
  return (
    <Router>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Space>
            <Link to="" className='disabled-link'>VT6003CEM Web API</Link>
            <Link to="/dog">Dog</Link>
            <Link to="/dog_add">Add Dog</Link>
            <Link to="/dog/:id">Edit Dog</Link>
            <Link to="/user/:id">User Profile</Link>
            <Link to="/user_edit/:id">Edit Profile</Link>
            <Link to="/SignIn">Sign In</Link>
            <Link to="/SignUp">Sign Out</Link>
            <Link to="/*">NotFound</Link>
          </Space>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dog</Breadcrumb.Item>
        </Breadcrumb>
        <Routes>
          <Route exact path="/" element={<DogScreen />} />
          <Route path="/dog" element={<DogScreen />} />
          <Route path="/dog_add" element={<DogAddScreen />} />
          <Route path="/dog/:id" element={<DogEditScreen />} />
          <Route path="/user/:id" element={<UserScreen />} />
          <Route path="/user_edit/:id" element={<UserEditScreen />} />
          <Route path="/SignIn" element={<SignInScreen />} />
          <Route path="/SignUp" element={<SignUpScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
    </Router>
  );
}