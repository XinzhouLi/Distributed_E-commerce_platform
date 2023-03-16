import React, { useEffect, useState }from 'react';
import {Container, Row, Col, Button, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate,useParams } from 'react-router-dom';
import socketConfig from '../socketConfig.js';


function SpecificCategory() {

  const [socket, setSocket] = useState(socketConfig, {
		reconnection: true
	});
  const [socketData,setSocketData] = useState(null)
  const navigate = useNavigate()
  const queryParam = new URLSearchParams(window.location.search)
  const cateName = queryParam.get("cateName")
  const imageURL = "https://source.unsplash.com/random/50×50/?"+cateName.toString()
  
  const[obj1Name,setObj1Name] = useState(null);
  const[obj2Name,setObj2Name] = useState(null);
  const[obj3Name,setObj3Name] = useState(null);
  const[obj4Name,setObj4Name] = useState(null);

  const[obj1ID,setObj1ID] = useState(null);
  const[obj2ID,setObj2ID] = useState(null);
  const[obj3ID,setObj3ID] = useState(null);
  const[obj4ID,setObj4ID] = useState(null);
    
  useEffect(() => {
    socket.emit("requestAllCateInfo", { "tableName":cateName })
    socket.on("responseAllCateInfo", function (data) {
        let socketData = JSON.parse(data)
        setObj1Name(socketData.content[0].itemName)
        setObj2Name(socketData.content[1].itemName)
        setObj3Name(socketData.content[2].itemName)
        setObj4Name(socketData.content[3].itemName)
        setObj1ID(socketData.content[0].itemID)
        setObj2ID(socketData.content[1].itemID)
        setObj3ID(socketData.content[2].itemID)
        setObj4ID(socketData.content[3].itemID)
    })
  })

  function handleBtnClick(e){
    if(e.target.id === 'obj1'){
        navigate('/Item?'+"cateName="+cateName.toString()+"&itemName="+obj1Name+"&itemID="+obj1ID);
    }
    else if(e.target.id === 'obj2'){
        navigate('/Item?'+"cateName="+cateName.toString()+"&itemName="+obj2Name+"&itemID="+obj2ID);
    }
    else if(e.target.id === 'obj3'){
        navigate('/Item?'+"cateName="+cateName.toString()+"&itemName="+obj3Name+"&itemID="+obj3ID);
    }
    else if(e.target.id === 'obj4'){
        navigate('/Item?'+"cateName="+cateName.toString()+"&itemName="+obj4Name+"&itemID="+obj4ID);
    }
    else{
        console.log('Error in redirecting')
    }
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <Container>
        <Form>
          <Form.Group>
            <Form.Label>Tracking Number</Form.Label>
            <Form.Control placeholder='XXXXXXXXXX'></Form.Control>
            <Form.Text> Enter 10 Digits Tracking Number</Form.Text>
          </Form.Group>
        </Form>
        <Button>Submit</Button>

        <Row>
        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = {imageURL} />
          <Card.Body>
            <Card.Title>
              {obj1Name}
            </Card.Title>
            <Card.Text>
            </Card.Text>
            <Button id='obj1' variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>

        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = {imageURL} />
          <Card.Body>
            <Card.Title>
            {obj2Name}
            </Card.Title>
            <Card.Text>
            </Card.Text>
            <Button id='obj2' variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>


        <Row>
        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = {imageURL} />
          <Card.Body>
            <Card.Title>
            {obj3Name}
            </Card.Title>
            <Card.Text>
            </Card.Text>
            <Button id='obj3' variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>

        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = {imageURL} />
          <Card.Body>
            <Card.Title>
            {obj4Name}
            </Card.Title>
            <Card.Text>
            </Card.Text>
            <Button id='obj4' variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>
        </Container>
      </header>
    </div>
  );
}

export default SpecificCategory;
