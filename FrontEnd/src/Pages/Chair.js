import React, { useEffect, useState }from 'react';
import {Container, Row, Col, Button, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate,useParams } from 'react-router-dom';


function Chair() {

  const navigate = useNavigate()
  const queryParam = new URLSearchParams(window.location.search)
  
  const chair1Name = queryParam.get("chair1Name")
  const chair2Name = queryParam.get("chair2Name")
  const chair3Name = queryParam.get("chair3Name")
  const chair4Name = queryParam.get("chair4Name")

  function handleBtnClick(e){
    console.log(e.target.id)
    // socket.emit()
    navigate('/Item?'+e.target.id.toString());
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
        <Card.Img src = "https://source.unsplash.com/random/50×50/?chair" />
          <Card.Body>
            <Card.Title>
              {chair1Name}
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button id={chair1Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>

        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = "https://source.unsplash.com/random/50×50/?chair" />
          <Card.Body>
            <Card.Title>
            {chair2Name}
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button id={chair2Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>


        <Row>
        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = "https://source.unsplash.com/random/50×50/?chair" />
          <Card.Body>
            <Card.Title>
            {chair3Name}
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button id={chair3Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>

        <Col>
        <Card style={{color : 'black'}}>
        <Card.Img src = "https://source.unsplash.com/random/50×50/?chair" />
          <Card.Body>
            <Card.Title>
            {chair4Name}
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button id={chair4Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>
        </Container>
      </header>
    </div>
  );
}

export default Chair;
