import React, { Component,useState, useEffect } from 'react';
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

import socketConfig from './socketConfig.js';


  // let io = require("socket.io-client")
  // let socket = io.connect("http://localhost:3010/",{
  //   reconnection: true 
  // })

  // socket.on('connect', function (socketWithLoadBalancer) {
  //   console.log('connected to localhost:3010')
  //   socket.emit("requestAllCateInfo","chair")
  // });
  
function App (){ 

  const [socket, setSocket] = useState(socketConfig,{
    reconnection: true 
  });

  useEffect(()=>{
    socket.on('connect', function () {
        console.log('connected to localhost:3010')
        socket.emit("handleTest","testMessage")
      });
  })

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

export default App;
