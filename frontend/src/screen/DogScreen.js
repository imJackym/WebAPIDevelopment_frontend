import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  
  return (
    <div>
      <div>
        <Button type="primary">
          <Link to="/dog_add">Add new dog</Link>
        </Button>
      </div>
      <br />
      {
        dogs.data?.map((dog) => (
          <div className="dog" key={dog.id}>
            <Link to={`/api/v1/dog/${dog.id}`}>
              <Card.Grid style={gridStyle}>
                <Card style={cardStyle} cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}>
                  <Meta title={`${dog.name}`} description={`${dog.brand}`} />
                </Card>
              </Card.Grid>
            </Link>
          </div>
        ))
      }
    </div >
  );
}

export default DogScreen;

