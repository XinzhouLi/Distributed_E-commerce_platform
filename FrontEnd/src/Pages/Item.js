import React, { useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Form,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import socketConfig from "../socketConfig.js";

function Item() {
  const [socket, setSocket] = useState(socketConfig, {
    reconnection: true,
  });

  const navigate = useNavigate();
  const queryParam = new URLSearchParams(window.location.search);
  const cateName = queryParam.get("cateName");
  const itemName = queryParam.get("itemName");
  const itemId = queryParam.get("itemId");
  const imageURL =
    "https://source.unsplash.com/random/50×50/?" + cateName.toString();

  const [description, setDescription] = useState(null);
  const [quantity, setQuantity] = React.useState(0);
  const [quantityToBuy, setQuantityToBuy] = React.useState(1);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    socket.emit("requestSingleItem", {
      tableName: cateName,
      idName: "itemId",
      id: itemId,
    });
    console.log("sent:");
    console.log(cateName + "itemId" + itemId);
    socket.on("responseSingleItemInfo", function (data) {
      const socketData = JSON.parse(data);
      console.log("socketData is below");
      console.log(socketData);
      setDescription(socketData.content.description);
      setQuantity(socketData.content.quantity);
      setLoading(false)
      console.log(description);
    });
  }, []);

  const handleMinusBtn = () => {
    if (quantityToBuy > 1) {
      setQuantityToBuy(quantityToBuy - 1);
    }
  };

  const handlePlusBtn = () => {
    setQuantityToBuy(quantityToBuy + 1);
  };

  const handleBuyBtn = () => {
    if (quantityToBuy <= quantity) {
      navigate(
        "/Payment" +
          "?cateName=" +
          cateName.toString() +
          "&itemName=" +
          itemName +
          "&itemId=" +
          itemId +
          "&quantityToBuy=" +
          quantityToBuy
      );
    } else {
      console.log("Exceed quantity");
      setShow(true);
    }
  };

  if (loading) {
		return <div>Loading...</div>;
	}

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Form>
            <Form.Group>
              <Form.Label>Tracking Number</Form.Label>
              <Form.Control placeholder="XXXXXXXXXX"></Form.Control>
              <Form.Text> Enter 10 Digits Tracking Number</Form.Text>
            </Form.Group>
          </Form>
          <Button>Submit</Button>

          <Card style={{ color: "black" }}>
            <Card.Img src={imageURL} />
            <Card.Body>
              <Card.Title>{itemName}</Card.Title>
              <Card.Text>{description}</Card.Text>
              <Row>
                <Col>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => handleMinusBtn()}
                  >
                    -
                  </button>
                </Col>
                <Col>{quantityToBuy}</Col>
                <Col>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => handlePlusBtn()}
                  >
                    +
                  </button>
                </Col>
              </Row>
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => handleBuyBtn()}
                >
                  BUY
                </button>
              </div>
            </Card.Body>
          </Card>
        </Container>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Woohoo, Items exceed quantity! We only have {quantity} in stock!{" "}
          </Modal.Body>
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

export default Item;
