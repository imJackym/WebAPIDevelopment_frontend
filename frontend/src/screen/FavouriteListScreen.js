import React, { useContext, useEffect, useState } from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../Store';

export default function FavouriteListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [fav, setFav] = useState("");
  const [doga, setDoga] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let name = `${userInfo.name}`
    let dog_a = []
    try {
      const data = await Axios.post(`http://localhost:5005/api/v1/user/favlist/`,
        { name },
        { headers: { Authorization: `Bearer ${userInfo.token}` }, }
      );
      for (let i = 0; i < data.data.favlist.length; i++) {
        let id = data.data.favlist[i]
        let dog = await Axios.get(('http://localhost:5005/api/v1/dog/' + id), {}, {});
        dog_a[i] = dog.data
      }
      setDoga(dog_a)
    } catch (err) {

    }
  };

  return (
    <>
      <List itemLayout="horizontal" dataSource={doga} renderItem={item => (
        <>
          <Link to={`/dog/${item._id}`}>
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={item.name}
                description={`Breed: ${item.name}, Adoption: ${item.adoption}, Description: ${item.description}`}
              />
            </List.Item>
          </Link>
        </>
      )}
      />
      <Button htmlType="reset"><Link to="/"> Back </Link></Button>
    </>
  )
}