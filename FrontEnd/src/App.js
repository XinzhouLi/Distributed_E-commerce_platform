import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MainPage from './Pages/MainPage';
import Chair from './Pages/Chair';
import Item from './Pages/Item';
import Payment from './Pages/Payment';
import Test from "./Pages/Test";



class App extends Component { 

  constructor(props){
    super(props);
    this.state = { apiResponse: "" };
  }
  
  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }
  
  componentWillMount() {
    this.callAPI();
  }

  render(){
    return(
      <div className="App">
        <Router>
          <Routes>
            <Route path='/' element={<MainPage />}/>
            <Route path='/Chair' element={<Chair />}/>
            <Route path='/Test' element={<Test />}/>
            <Route path='/Item' element={<Item />}/>
            <Route path='*' element={<MainPage />}/>
          </Routes>
        </Router>
      </div> 
    );
  }
}

export default App;
