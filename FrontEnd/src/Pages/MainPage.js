import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate} from 'react-router-dom';
import socketConfig from '../socketConfig.js';

function MainPage() {
	const [socket, setSocket] = useState(socketConfig, {
		reconnection: true
	});

	const navigate = useNavigate(); // react-router-dom v6
	const [socketData,setSocketData] = React.useState(null);

	useEffect(()=>{
		if(socketData){
			navigate(`/SpecificCategory?${socketData}`);
		}
	},[socketData,navigate])

	const handleBtnClick = (e) => {
		const cateName =  e.target.id.toString();
		socket.emit("requestAllCateInfo", { "tableName":cateName })
		socket.on("responseAllCateInfo", async function (data) {
			let ans = JSON.parse(data)
			if(cateName === 'chair'){
				setSocketData("cateName="+cateName+"&obj1="+ans.content[0].chairName
				+'&'+"obj2="+ans.content[1].chairName
				+'&'+"obj3="+ans.content[2].chairName
				+'&'+"obj4="+ans.content[3].chairName)
			}
			if(cateName === 'tables'){
				setSocketData("cateName="+cateName+"&obj1="+ans.content[0].tableName
				+'&'+"obj2="+ans.content[1].tableName
				+'&'+"obj3="+ans.content[2].tableName
				+'&'+"obj4="+ans.content[3].tableName)
			}
			if(cateName === 'bed'){
				setSocketData("cateName="+cateName+"&obj1="+ans.content[0].bedName
				+'&'+"obj2="+ans.content[1].bedName
				+'&'+"obj3="+ans.content[2].bedName
				+'&'+"obj4="+ans.content[3].bedName)
			}
			if(cateName === 'sofa'){
				setSocketData("cateName="+cateName+"&obj1="+ans.content[0].sofaName
				+'&'+"obj2="+ans.content[1].sofaName
				+'&'+"obj3="+ans.content[2].sofaName
				+'&'+"obj4="+ans.content[3].sofaName)
			}
		})
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
							<Card style={{ color: 'black' }}>
								<Card.Img src="https://source.unsplash.com/random/50×50/?chair" />
								<Card.Body>
									<Card.Title>
										Card Example
									</Card.Title>
									<Card.Text>
										Something
									</Card.Text>
									<Button id='chair' variant='primary' onClick={(e)=>handleBtnClick(e)}> Chair </Button>
								</Card.Body>
							</Card>
						</Col>

						<Col>
							<Card style={{ color: 'black' }}>
								<Card.Img src="https://source.unsplash.com/random/50×50/?table" />
								<Card.Body>
									<Card.Title>
										Card Example
									</Card.Title>
									<Card.Text>
										Something
									</Card.Text>
									<Button id='tables' variant='primary' onClick={(e)=>handleBtnClick(e)}> Table </Button>
								</Card.Body>
							</Card>
						</Col>
					</Row>


					<Row>
						<Col>
							<Card style={{ color: 'black' }}>
								<Card.Img src="https://source.unsplash.com/random/50×50/?bed" />
								<Card.Body>
									<Card.Title>
										Card Example
									</Card.Title>
									<Card.Text>
										Something
									</Card.Text>
									<Button id='bed' variant='primary' onClick={(e)=>handleBtnClick(e)}> Bed </Button>
								</Card.Body>
							</Card>
						</Col>

						<Col>
							<Card style={{ color: 'black' }}>
								<Card.Img src="https://source.unsplash.com/random/50×50/?sofa" />
								<Card.Body>
									<Card.Title>
										Card Example
									</Card.Title>
									<Card.Text>
										Something
									</Card.Text>
									<Button id='sofa' variant='primary' onClick={(e)=>handleBtnClick(e)}> Sofa </Button>
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

export default MainPage;
