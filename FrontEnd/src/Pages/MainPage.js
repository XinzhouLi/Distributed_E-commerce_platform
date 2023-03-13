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
	const [chairData,setChairData] = React.useState(null);
	const [tableData,setTableData] = React.useState(null);
	const [sofaData,setSofaData] = React.useState(null);
	const [bedData,setbedData] = React.useState(null);

	useEffect(()=>{
		if(chairData){
			navigate(`/chair?${chairData}`);
		}
	},[chairData,navigate])

	useEffect(()=>{
		if(tableData){
			navigate(`/table?tableData=${tableData}`);
		}
	},[tableData,navigate])

	useEffect(()=>{
		if(sofaData){
			navigate(`/sofa?sofaData=${sofaData}`);
		}
	},[sofaData,navigate])

	useEffect(()=>{
		if(bedData){
			navigate(`/bed?bedData=${bedData}`);
		}
	},[bedData,navigate])

	const handleChairBtnClick = () => {
		socket.emit("requestAllCateInfo", { "tableName": "chair" })
		socket.on("responseAllCateInfo", async function (data) {
			let ans = JSON.parse(data)
			setChairData("chair1Name="+ans.content[0].chairName
				+'&'+"chair2Name="+ans.content[1].chairName
				+'&'+"chair3Name="+ans.content[2].chairName
				+'&'+"chair4Name="+ans.content[3].chairName)
			
		})
	}

	const handleTableBtnClick = () => {
		socket.emit("requestAllCateInfo", { "tableName": "tables" })
		socket.on("responseAllCateInfo", async function (data) {
			let ans = JSON.parse(data)
			setTableData(ans.content[0].tableName
				+'&'+ans.content[1].tableName
				+'&'+ans.content[2].tableName
				+'&'+ans.content[3].tableName)
			
		})
	}

	const handleSofaBtnClick = () => {
		socket.emit("requestAllCateInfo", { "tableName": "sofa" })
		socket.on("responseAllCateInfo", async function (data) {
			let ans = JSON.parse(data)
			setSofaData(ans.content[0].sofaName
				+'&'+ans.content[1].sofaName
				+'&'+ans.content[2].sofaName
				+'&'+ans.content[3].sofaName)
			
		})
	}

	const handleBedBtnClick = (e) => {
		socket.emit("requestAllCateInfo", { "tableName": e.target.id.toString() })
		socket.on("responseAllCateInfo", async function (data) {
			let ans = JSON.parse(data)
			setbedData(ans.content[0].bedName
				+'&'+ans.content[1].bedName
				+'&'+ans.content[2].bedName
				+'&'+ans.content[3].bedName)
			
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
									<Button id='chair' variant='primary' onClick={(e)=>handleChairBtnClick(e)}> Chair </Button>
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
									<Button id='tables' variant='primary' onClick={(e)=>handleTableBtnClick(e)}> Table </Button>
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
									<Button id='bed' variant='primary' onClick={()=>handleBedBtnClick()}> Bed </Button>
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
									<Button id='sofa' variant='primary' onClick={()=>handleSofaBtnClick()}> Sofa </Button>
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
