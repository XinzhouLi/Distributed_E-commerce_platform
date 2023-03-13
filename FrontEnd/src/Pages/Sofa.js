import React from 'react';
import {Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';


function Sofa() {

  const navigate = useNavigate()
  const queryParam = new URLSearchParams(window.location.search)
  const sofa1Name = queryParam.get("sofa1Name")
  const sofa2Name = queryParam.get("sofa2Name")
  const sofa3Name = queryParam.get("sofa3Name")
  const sofa4Name = queryParam.get("sofa4Name")

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
        <Card style={{color : 'black' }}>
          <Card.Img src = "https://picsum.photos/200/100" />
          <Card.Body>
            <Card.Title>
              Chair 1
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary'> BUY </Button>
          </Card.Body>
        </Card>
        </Col>
        
        <Col>
        <Card style={{color : 'black'}}>
          <Card.Img src = "https://picsum.photos/200/100" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary'> More </Button>
          </Card.Body>
        </Card>
        </Col>

        <Col>
        <Card style={{color : 'black'}}>
          <Card.Img src = "https://picsum.photos/200/100" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary'> More </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>


        <Row>
        <Col>
        <Card style={{color : 'black' }}>
          <Card.Img src = "https://picsum.photos/200/100" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary' type='submit'> More </Button>
          </Card.Body>
        </Card>
        </Col>
        
        <Col>
        <Card style={{color : 'black'}}>
          <Card.Img src = "https://picsum.photos/200/100" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary'> More </Button>
          </Card.Body>
        </Card>
        </Col>

        <Col>
        <Card style={{color : 'black'}}>
          <Card.Img src = "https://picsum.photos/200/100" />
          <Card.Body>
            <Card.Title>
              Card Example
            </Card.Title>
            <Card.Text>
              Something
            </Card.Text>
            <Button variant='primary'> More </Button>
          </Card.Body>
        </Card>
        </Col>
        </Row>

        {/* <Breadcrumb>
          <Breadcrumb.Item>Test</Breadcrumb.Item>
          <Breadcrumb.Item>Test1</Breadcrumb.Item>
          <Breadcrumb.Item>Test2</Breadcrumb.Item>
        </Breadcrumb>
        <Alert variant = "secondary">This is a button</Alert>
        <Button>Test Button</Button> */}
        </Container>
      </header>
    </div>
  );
}

export default Sofa;
