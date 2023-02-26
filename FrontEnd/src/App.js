import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Container, Row, Col, Button, Alert, Breadcrumb, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom"
import MainPage from './Pages/MainPage';
import Chair from './Pages/Chair';
import Payment from './Pages/Payment';
import Test from "./Pages/Test";

function App() { 
  return(
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />}/>
          <Route path='/Chair' element={<Chair />}/>
          <Route path='*' element={<MainPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
