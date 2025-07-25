import { io } from 'socket.io-client';

// Asegúrate que tu backend corra en este puerto/IP
const socket = io('http://localhost:3000');

export default socket;
