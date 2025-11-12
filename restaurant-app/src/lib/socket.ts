"use client";

import { io } from 'socket.io-client';

// Connect to your standalone socket server
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We will connect manually
});