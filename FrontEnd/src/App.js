import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MainPage from './Pages/MainPage';
import SpecificCategory from './Pages/SpecificCategory';
import Item from './Pages/Item';
import Payment from './Pages/Payment';
import socketConfig from './socketConfig.js';
import ErrorPage from './Pages/ErrorPage'

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
              <Route path='/SpecificCategory' element={<SpecificCategory />}/>
              <Route path='/Item' element={<Item />}/>
              <Route path='/Payment' element={<Payment />}/>
              <Route path='*' element={<ErrorPage />}/>
            </Routes>
          </Router>
      </div> 
    );
  }

export default App;
