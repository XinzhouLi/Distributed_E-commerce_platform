import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import io from "socket.io-client"


let socket = io.connect("http://localhost:3010")
socket.on('connect', function () {
  console.log('connected to localhost:3010')
});


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
