import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Breadcrumb,
  Card,
  Form,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import socketConfig from "../socketConfig.js";

function MainPage() {
  const navigate = useNavigate(); // react-router-dom v6
  const [socketData, setSocketData] = React.useState(null);
  const [orderInfo, setOrderInfo] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [socket, setSocket] = useState(socketConfig, {
    reconnection: true,
  });
  const [status, setStatus] = React.useState(0);
  const [item, setItem] = useState("");
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");

  const handleClose = () => setShowAlert(false);
  const handleOrderSearch = () => {
    socket.emit("requestSingleItem", {
      tableName: "orderInfo",
      idName: "orderId",
      id: orderInfo,
    });
    // console.log("sent:");
    // console.log(cateName + "itemId" + itemId);
    socket.on("responseSingleItemInfo", function (data) {
      let socketData = JSON.parse(data);
      console.log("socketData is below");
      console.log(socketData);
      setStatus(socketData.status);
      setItem(socketData.content.itemName);
      setAddress(socketData.content.customerAddress);
      setCustomer(socketData.content.customerName);
      setShowAlert(true);
    });
  };

  useEffect(() => {
    if (socketData) {
      navigate(`/SpecificCategory?${socketData}`);
    }
  }, [socketData, navigate]);

  const handleBtnClick = (e) => {
    const cateName = e.target.id.toString();
    setSocketData("cateName=" + cateName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Form.Label>Enter Tracking Number To Search Order</Form.Label>
          <Form.Control
            placeholder="XXXXXXXXXX"
            type="text"
            name="orderInfo"
            value={orderInfo}
            onChange={(e) => setOrderInfo(e.target.value)}
          ></Form.Control>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => handleOrderSearch()}
          >
            Search Order
          </button>

          {/* {showAlert && ( */}
          <Modal show={showAlert} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Order Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {printOrderInfo(status, orderInfo, item, customer, address)}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
          {/* )} */}
          <br />
          <br />
          <Row>
            <Col>
              <Card style={{ color: "black" }}>
                <Card.Img src="https://source.unsplash.com/random/50×50/?chair" />
                <Card.Body>
                  <Card.Title>Card Example</Card.Title>
                  <Card.Text>Something</Card.Text>
                  <Button
                    id="chair"
                    variant="primary"
                    onClick={(e) => handleBtnClick(e)}
                  >
                    {" "}
                    Chair{" "}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card style={{ color: "black" }}>
                <Card.Img src="https://source.unsplash.com/random/50×50/?table" />
                <Card.Body>
                  <Card.Title>Card Example</Card.Title>
                  <Card.Text>Something</Card.Text>
                  <Button
                    id="tables"
                    variant="primary"
                    onClick={(e) => handleBtnClick(e)}
                  >
                    {" "}
                    Table{" "}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card style={{ color: "black" }}>
                <Card.Img src="https://source.unsplash.com/random/50×50/?bed" />
                <Card.Body>
                  <Card.Title>Card Example</Card.Title>
                  <Card.Text>Something</Card.Text>
                  <Button
                    id="bed"
                    variant="primary"
                    onClick={(e) => handleBtnClick(e)}
                  >
                    {" "}
                    Bed{" "}
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card style={{ color: "black" }}>
                <Card.Img src="https://source.unsplash.com/random/50×50/?sofa" />
                <Card.Body>
                  <Card.Title>Card Example</Card.Title>
                  <Card.Text>Something</Card.Text>
                  <Button
                    id="sofa"
                    variant="primary"
                    onClick={(e) => handleBtnClick(e)}
                  >
                    {" "}
                    Sofa{" "}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Breadcrumb>
            <Breadcrumb.Item>Test</Breadcrumb.Item>
            <Breadcrumb.Item>Test1</Breadcrumb.Item>
            <Breadcrumb.Item>Test2</Breadcrumb.Item>
          </Breadcrumb>
          <Alert variant="secondary">This is a button</Alert>
          <Button>Test Button</Button>
        </Container>
      </header>
    </div>
  );
}

function printOrderInfo(status, orderInfo, item, customer, address) {
  if (status == 0) {
    return (
      <ul>
        <li>Order Does Not Exist</li>
      </ul>
    );
  } else {
    return (
      <ul>
        <li>Order Id: {orderInfo}</li>
        <li>Order Item: {item}</li>
        <li>Customer Name: {customer}</li>
        <li>Customer Address: {address}</li>
      </ul>
    );
  }
}

export default MainPage;
