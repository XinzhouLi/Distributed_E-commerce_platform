import React from 'react';
import {Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate } from 'react-router-dom';

function MainPage() {

  const [goToChair, setGoToChair] = React.useState(false)
  const [goToTable, setGoToTable] = React.useState(false)
  const [goToSofa, setGoToSofa] = React.useState(false)
  const [goToBed, setGoToBed] = React.useState(false)

  
  if(goToChair){
    return <Navigate to= "/Chair"/>;
  }

  if(goToTable){
    return <Navigate to= "/Table"/>;
  }

  if(goToSofa){
    return <Navigate to= "/Sofa"/>;
  }

  if(goToBed){
    return <Navigate to= "/Bed"/>;
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
          <Card.Img src = "https://picsum.photos/200/100" />
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
            <Button variant='primary'> Sofa </Button>
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
            <Button variant='primary' type='submit'> Bed </Button>
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
