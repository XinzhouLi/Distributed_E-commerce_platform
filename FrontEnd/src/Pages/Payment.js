import React from 'react';
import {Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

function Payment() {
  return (
    <div className="App">
      <header className="App-header">
        <Container>

        <Form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control placeholder='XXX@Example.com'></Form.Control>
          </Form.Group>
        </Form>

        <Form>
          <Form.Group>
            <Form.Label>Card Number</Form.Label>
            <Form.Control placeholder='XXXX-XXXX-XXXX-XXXX'></Form.Control>
          </Form.Group>
        </Form>

        <Form>
          <Form.Group>
            <Form.Label>CVV</Form.Label>
            <Form.Control placeholder='XXX'></Form.Control>
          </Form.Group>
        </Form>

        <Form>
          <Form.Group>
            <Form.Label>Expire Date</Form.Label>
            <Form.Control placeholder='MM/YY'></Form.Control>
          </Form.Group>
        </Form>

        <Form>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control></Form.Control>
            <Form.Text> Enter 10 Digits Tracking Number</Form.Text>
          </Form.Group>
        </Form>


        <Button>Submit</Button>
        </Container>
      </header>
    </div>
  );
}

export default Payment;
