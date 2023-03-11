import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom/client';

import {Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import socketConfig from '../socketConfig.js';


// let io = require("socket.io-client")
// let socket = io.connect("http://localhost:3010/",{
//   reconnection: true 
// })

// socket.on('connect', function (socketWithLoadBalancer) {
//   console.log('connected to localhost:3010')
//   socket.emit("requestAllCateInfo","chair")
// });




function MainPage() {
  
  const [socket, setSocket] = useState(socketConfig,{
    reconnection: true 
  });

  const navigate = useNavigate(); // react-router-dom v6
  const [goToChair, setGoToChair] = React.useState(false)
  const [goToTable, setGoToTable] = React.useState(false)
  const [goToSofa, setGoToSofa] = React.useState(false)
  const [goToBed, setGoToBed] = React.useState(false)

  
  useEffect(() => {
    function nav() {
      if(goToChair){
        console.log('giveMeChairs')
        socket.emit("requestAllCateInfo","aquireChairs")
        navigate('/chair')
      }
    }
    nav()
  }, [goToChair,navigate])

  useEffect(()=>{
    function nav(){
      if(goToBed){
        navigate('/bed')
      }
    }
    nav()
  },[goToBed,navigate])

  useEffect(()=>{
    function nav(){
      if(goToTable){
        navigate('/table')
      }
    }
    nav()
  },[goToTable,navigate])


  useEffect(()=>{
    function nav(){
      if(goToSofa){
        navigate('/sofa')
      }
    }
    nav()
  },[goToSofa,navigate])

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
        <Card style={{color : 'black' }}>
          <Card.Img src = "https://source.unsplash.com/random/50×50/?chair" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary' onClick={()=>setGoToChair(true)}> Chair </Button>
          </Card.Body>
        </Card>
        </Col>
        
        <Col>
        <Card style={{color : 'black'}}>
          <Card.Img src = "https://source.unsplash.com/random/50×50/?table" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary' onClick={()=>setGoToTable(true)}> Table </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>


        <Row>
        <Col>
        <Card style={{color : 'black' }}>
          <Card.Img src = "https://source.unsplash.com/random/50×50/?bed" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary' onClick={()=>setGoToBed(true)}> Bed </Button>
          </Card.Body>
        </Card>
        </Col>
        
        <Col>
        <Card style={{color : 'black'}}>
          <Card.Img src = "https://source.unsplash.com/random/50×50/?sofa" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary' onClick={()=>setGoToSofa(true)}> Sofa </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>


        <Breadcrumb>
          <Breadcrumb.Item>Test</Breadcrumb.Item>
          <Breadcrumb.Item>Test1</Breadcrumb.Item>
          <Breadcrumb.Item>Test2</Breadcrumb.Item>
        </Breadcrumb>
        <Alert variant = "secondary">This is a button</Alert>
        <Button>Test Button</Button>
        </Container>
      </header>
    </div>
  );
}

export default MainPage;
