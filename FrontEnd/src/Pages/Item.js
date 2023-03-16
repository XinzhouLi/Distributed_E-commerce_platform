import React, { useEffect, useState} from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import {Container, Button, Card, Form, Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function Item() {

  const navigate = useNavigate()
  const [quantity,setQuantity] = React.useState(0)
  const queryParam = new URLSearchParams(window.location.search)
  const cateName = queryParam.get("cateName")
  const itemName = queryParam.get("itemName")
  const imageURL = "https://source.unsplash.com/random/50×50/?"+cateName.toString()


  const handleMinusBtn = () =>{
    if(quantity>1){
      setQuantity(quantity-1);
    }
  }

  const handlePlusBtn = () =>{
    setQuantity(quantity+1);
  }

  const handleBuyBtn = () =>{
    navigate('/Payment')
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

        <Card style={{color : 'black' }}>
          <Card.Img src = {imageURL} />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Row>
              <Col>
                <button type="button" className="btn btn-primary btn-lg" onClick={()=>handleMinusBtn()}>-</button>
              </Col>
              <Col>
                {quantity}
              </Col>
              <Col>
                <button type="button" className="btn btn-primary btn-lg" onClick={()=>handlePlusBtn()}>+</button>
              </Col>
            </Row>
            <div>
              <button type="button" className="btn btn-primary btn-lg" onClick={()=>handleBuyBtn()}>BUY</button>
            </div>
          </Card.Body>
        </Card>
        </Container>
      </header>
    </div>
  );
}

export default Item;
