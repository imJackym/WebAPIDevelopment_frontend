import { Card, Col, Row, Avatar, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import data from './data_dog';

const { Meta } = Card;

const gridStyle = {
  width: '25%',
  // textAlign: 'center',
};

const cardStyle = {
  margin: 'auto',
  width: 'fit-content',
};

function DogScreen() {

  // const dogs = [1,2,34,54,56,1];

  const [dogs, setDogs] = useState([]);
  useEffect(() => {
    console.log("useEffectuseEffect");
    const fetchData = async () => {
      const result = await axios.get('http://localhost:5005/api/v1/dog');
      console.log(result)
      setDogs(result.data);
    };
    fetchData();
  }, []);
  console.log("dogs : " + dogs);

  return (
    <div>
      <div>
        <Button type="primary">
          <Link to="/dog_add">Add new dog</Link>
        </Button>
      </div>
      <br />
      {
        data.dogs.map((dog) => (
          <div className="dog" key={dog.id}>
            <a href={`/dog/${dog.id}`}>
              <Card.Grid style={gridStyle}>
                <Card style={cardStyle} cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}>
                  <Meta title={`${dog.name}`} description={`${dog.brand}`} />
                </Card>
              </Card.Grid>
            </a>
          </div>
        ))
      }
    </div >
  );
}

export default DogScreen;

