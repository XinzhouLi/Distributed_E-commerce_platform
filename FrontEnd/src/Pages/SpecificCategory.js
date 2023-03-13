import React, { useEffect, useState }from 'react';
import {Container, Row, Col, Button, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate,useParams } from 'react-router-dom';


function SpecificCategory() {

  const navigate = useNavigate()
  const queryParam = new URLSearchParams(window.location.search)

  const cateName = queryParam.get("cateName")
  const obj1Name = queryParam.get("obj1")
  const obj2Name = queryParam.get("obj2")
  const obj3Name = queryParam.get("obj3")
  const obj4Name = queryParam.get("obj4")

  const imageURL = "https://source.unsplash.com/random/50×50/?"+cateName.toString()
  

  function handleBtnClick(e){
    // socket.emit()
    navigate('/Item?'+"cateName="+cateName.toString()+"&itemName="+e.target.id.toString());
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
              Something
            </Card.Text>
            <Button id={obj1Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
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
              Something
            </Card.Text>
            <Button id={obj2Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
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
              Something
            </Card.Text>
            <Button id={obj3Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
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
              Something
            </Card.Text>
            <Button id={obj4Name} variant='primary' onClick={(e)=>handleBtnClick(e)}> More </Button>
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
