import React, { useState } from "react";
import {
  Container,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  Alert,
} from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom";
import socketConfig from "../socketConfig.js";

function Payment() {
  const navigate = useNavigate(); // react-router-dom v6

  const queryParam = new URLSearchParams(window.location.search);
  const cateName = queryParam.get("cateName");
  const itemName = queryParam.get("itemName");
  const itemId = queryParam.get("itemId");
  const quantityToBuy = queryParam.get("quantityToBuy");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp_date, setExp_date] = useState("");
  const [secu_code, setSecu_code] = useState("");

  const UUID = Math.floor(Math.random() * 1000000);

  const [socket, setSocket] = useState(socketConfig, {
    reconnection: true,
  });

  function handleSubmit() {
    console.log(name);
    console.log(address);
    console.log(cardNumber);
    console.log(exp_date);
    console.log(secu_code);

    console.log();

    socket.emit("addOrder", {
      tableName: cateName,
      idName: "itemId",
      id: itemId,
      quantityToBuy: quantityToBuy,
      insertOrderData:
        "'" +
        UUID +
        "'" +
        "," +
        "'" +
        name +
        "'" +
        "," +
        "'" +
        address +
        "'" +
        "," +
        "'" +
        cardNumber +
        "'" +
        "," +
        "'" +
        exp_date +
        "'" +
        "," +
        "'" +
        secu_code +
        "'" +
        "," +
        "'" +
        itemName +
        "'",
    });
    socket.on("responseUserOrderStatus", function (data) {
      let socketData = JSON.parse(data);
      console.log("socketData is below");
      console.log(socketData);
      if (socketData.status == 1) {
        setOrderStatus(socketData.content + " !	Your Order Number is: " + UUID);
      } else {
        setOrderStatus(
          socketData.content + " !	We will inform you when we have it "
        );
      }
      console.log(orderStatus);
      setShow(true);
    });
  }
  const [orderStatus, setOrderStatus] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Form>
            <Form.Group>
              <Form.Label>CustomerName</Form.Label>
              <Form.Control
                placeholder="Please input your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                placeholder="Please input your mail address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group>
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                placeholder="Please input your card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group>
              <Form.Label>exp_date</Form.Label>
              <Form.Control
                placeholder="Please input your exp_date, ex: 06/14"
                value={exp_date}
                onChange={(e) => setExp_date(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Form>

          <Form>
            <Form.Group>
              <Form.Label>secu_code</Form.Label>
              <Form.Control
                placeholder="Please input your 3 digits CVV"
                value={secu_code}
                onChange={(e) => setSecu_code(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Form>

          <Button onClick={() => handleSubmit()}>Submit</Button>
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo! {orderStatus}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </header>
    </div>
  );
}

export default Payment;
