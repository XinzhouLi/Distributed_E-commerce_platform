import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// let io = require("socket.io-client")
// let socket = io.connect("http://localhost:3010/",{
//   reconnection: true 
// })

// socket.on('connect', function (socketWithLoadBalancer) {
//   console.log('connected to localhost:3010')
//   socket.emit("requestAllCateInfo","chair")
// });


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
