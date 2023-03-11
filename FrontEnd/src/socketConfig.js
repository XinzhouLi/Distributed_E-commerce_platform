import openSocket from 'socket.io-client';

const socket = openSocket("http://localhost:3010");

export default socket;