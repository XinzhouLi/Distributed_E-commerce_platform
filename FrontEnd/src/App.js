import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MainPage from './Pages/MainPage';
import Chair from './Pages/Chair';
import Bed from './Pages/Bed';
import Sofa from './Pages/Sofa';
import Table from './Pages/Table';
import Item from './Pages/Item';
import Payment from './Pages/Payment';
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
              <Route path='/Table' element={<Table />}/>
              <Route path='/Sofa' element={<Sofa />}/>
              <Route path='/Bed' element={<Bed />}/>
              <Route path='/Item' element={<Item />}/>
              <Route path='/Payment' element={<Payment />}/>
              <Route path='*' element={<MainPage />}/>
            </Routes>
          </Router>
      </div> 
    );
  }

export default App;
